<?php
declare(strict_types=1);

// This module must only run on the server. router.php denies its public URL.
function rumbo_config(string $key, string $default = ''): string {
    static $config = null;
    if ($config === null) {
        $config = [];
        $path = dirname(__DIR__, 2) . '/.env';
        foreach (is_file($path) ? file($path, FILE_IGNORE_NEW_LINES) : [] as $line) {
            if (!preg_match('/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/', $line, $m)) continue;
            $value = trim($m[2]);
            if (strlen($value) >= 2 && (($value[0] === '"' && substr($value, -1) === '"') || ($value[0] === "'" && substr($value, -1) === "'"))) $value = substr($value, 1, -1);
            $config[$m[1]] = $value;
        }
    }
    $environment = getenv($key);
    return $environment !== false ? $environment : ($config[$key] ?? $default);
}

function db(?string $database = null): PDO {
    static $connections = [];
    if (!extension_loaded('pdo_sqlsrv')) throw new RuntimeException('Falta PDO_SQLSRV. Ejecuta CONFIGURAR-PHP.cmd.');
    $database ??= rumbo_config('DB_NAME', 'BD_VIAJES');
    if (isset($connections[$database])) return $connections[$database];
    $server = rumbo_config('DB_SERVER', 'localhost');
    if (rumbo_config('DB_PORT') !== '') $server .= ',' . rumbo_config('DB_PORT');
    foreach ([$server, $database] as $part) if (preg_match('/[;{}\r\n]/', $part)) throw new RuntimeException('Configuración SQL inválida.');
    $trust = rumbo_config('DB_TRUST_CERTIFICATE', 'false') === 'true' ? '1' : '0';
    $dsn = "sqlsrv:Server=$server;Database=$database;Encrypt=1;TrustServerCertificate=$trust;LoginTimeout=5";
    $windows = rumbo_config('DB_AUTH', 'windows') === 'windows';
    $connections[$database] = new PDO($dsn, $windows ? null : rumbo_config('DB_USER'), $windows ? null : rumbo_config('DB_PASSWORD'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::SQLSRV_ATTR_ENCODING => PDO::SQLSRV_ENCODING_UTF8,
        PDO::SQLSRV_ATTR_QUERY_TIMEOUT => 10,
    ]);
    return $connections[$database];
}

function query(string $sql, array $params = [], ?PDO $connection = null): PDOStatement {
    $statement = ($connection ?? db())->prepare($sql);
    $statement->execute($params);
    return $statement;
}

function encode_json(mixed $value): string {
    return json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
}

final class HttpError extends RuntimeException {
    public function __construct(public int $status, string $message) { parent::__construct($message); }
}

function respond(int $status, mixed $data): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo encode_json($data);
    exit;
}

function request_body(int $limit = 60000): stdClass {
    if (strtolower(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]) !== 'application/json') throw new HttpError(415, 'Se requiere JSON.');
    $raw = file_get_contents('php://input', false, null, 0, $limit + 1);
    if (strlen($raw) > $limit) throw new HttpError(413, 'La solicitud es demasiado grande.');
    try { $body = json_decode($raw, false, 64, JSON_THROW_ON_ERROR); }
    catch (JsonException) { throw new HttpError(400, 'JSON inválido.'); }
    if (!$body instanceof stdClass) throw new HttpError(400, 'Solicitud inválida.');
    return $body;
}

function check_origin(): void {
    $expected = rumbo_config('PHP_APP_ORIGIN') ?: 'http://' . ($_SERVER['HTTP_HOST'] ?? '');
    if (($_SERVER['HTTP_ORIGIN'] ?? '') !== $expected || ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') throw new HttpError(403, 'Origen no permitido.');
}

function set_cookie(string $name, string $value, int $expires): void {
    setcookie($name, $value, ['expires' => $expires, 'path' => '/', 'secure' => str_starts_with(rumbo_config('PHP_APP_ORIGIN'), 'https://'), 'httponly' => true, 'samesite' => 'Lax']);
}
