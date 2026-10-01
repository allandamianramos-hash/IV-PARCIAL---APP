<?php
declare(strict_types=1);
require_once __DIR__ . '/conexion.php';

function verify_password(string $password, string $hash): bool {
    if (!str_starts_with($hash, 'scrypt:')) return strlen($password)<=72 && password_verify($password, $hash);
    $command = [rumbo_config('NODE_BIN', 'node'), __DIR__ . '/verify-legacy.mjs'];
    $process = proc_open($command, [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']], $pipes, dirname(__DIR__), null, ['bypass_shell'=>true]);
    if (!is_resource($process)) throw new RuntimeException('No se pudo verificar la cuenta anterior.');
    fwrite($pipes[0], encode_json(['password'=>$password,'hash'=>$hash]));fclose($pipes[0]);
    $result=stream_get_contents($pipes[1]);fclose($pipes[1]);fclose($pipes[2]);
    $code=proc_close($process);
    if ($code!==0) throw new RuntimeException('No se pudo verificar la cuenta anterior.');
    return $result==='true';
}

function auth_user(): ?array {
    $token = $_COOKIE['rumbo_session'] ?? '';
    if (!preg_match('/^[a-f0-9]{64}$/D', $token)) return null;
    $row = query('SELECT u.Id, u.Email, u.FullName, u.VisitorId FROM dbo.RumboSessions s JOIN dbo.RumboUsers u ON u.Id=s.UserId WHERE s.TokenHash=? AND s.ExpiresAt>SYSUTCDATETIME()', [hash('sha256', $token)])->fetch();
    return $row ?: null;
}

function public_user(?array $user): ?array {
    return $user ? ['id' => $user['Id'], 'email' => $user['Email'], 'name' => $user['FullName']] : null;
}

function new_owner(): string {
    // User owners have a random hash whose raw visitor token is never issued.
    return query('INSERT dbo.RumboVisitors(TokenHash) OUTPUT INSERTED.Id VALUES(?)', [hash('sha256', random_bytes(32))])->fetchColumn();
}

function guest_owner(bool $create = false): ?string {
    $token = $_COOKIE['rumbo_visitor'] ?? '';
    if (preg_match('/^[a-f0-9]{64}$/D', $token)) {
        // Defense in depth: a visitor cookie must never authorize a registered owner.
        $id = query('SELECT v.Id FROM dbo.RumboVisitors v WHERE v.TokenHash=? AND NOT EXISTS(SELECT 1 FROM dbo.RumboUsers u WHERE u.VisitorId=v.Id)', [hash('sha256', $token)])->fetchColumn();
        if ($id) return $id;
    }
    if (!$create) return null;
    $token = bin2hex(random_bytes(32));
    $id = query('INSERT dbo.RumboVisitors(TokenHash) OUTPUT INSERTED.Id VALUES(?)', [hash('sha256', $token)])->fetchColumn();
    set_cookie('rumbo_visitor', $token, time() + 31536000);
    return $id;
}

function state_owner(bool $create = false): ?string {
    return auth_user()['VisitorId'] ?? guest_owner($create);
}

function issue_session(string $userId): void {
    $old = $_COOKIE['rumbo_session'] ?? '';
    if (preg_match('/^[a-f0-9]{64}$/D', $old)) query('DELETE dbo.RumboSessions WHERE TokenHash=?', [hash('sha256', $old)]);
    $token = bin2hex(random_bytes(32));
    query('INSERT dbo.RumboSessions(TokenHash,UserId,ExpiresAt) VALUES(?,?,DATEADD(day,30,SYSUTCDATETIME()))', [hash('sha256', $token), $userId]);
    set_cookie('rumbo_session', $token, time() + 30 * 86400);
}

function auth_rate_limit(): void {
    // Separate local development servers sharing one hosted database.
    $ip = hash('sha256', gethostname() . ':' . ($_SERVER['REMOTE_ADDR'] ?? 'local'));
    $connection = db(); $connection->beginTransaction();
    try {
        query("DECLARE @r int; EXEC @r=sp_getapplock @Resource=?, @LockMode='Exclusive', @LockOwner='Transaction', @LockTimeout=5000; IF @r<0 THROW 51000, 'Auth lock unavailable', 1;", ['RumboAuth:' . $ip])->closeCursor();
        query('DELETE dbo.RumboAuthAttempts WHERE AttemptedAt<DATEADD(day,-1,SYSUTCDATETIME())')->closeCursor();
        $count = (int)query('SELECT COUNT(*) FROM dbo.RumboAuthAttempts WHERE IpHash=? AND AttemptedAt>DATEADD(minute,-15,SYSUTCDATETIME())', [$ip])->fetchColumn();
        if ($count >= 20) { $connection->rollBack(); throw new HttpError(429, 'Demasiados intentos. Inténtalo en 15 minutos.'); }
        query('INSERT dbo.RumboAuthAttempts(IpHash) VALUES(?)', [$ip])->closeCursor();
        $connection->commit();
    } catch (Throwable $e) { if ($connection->inTransaction()) $connection->rollBack(); throw $e; }
}

function handle_auth(string $path, string $method): never {
    if (rumbo_config('DB_ENABLED') !== 'true') throw new HttpError(503, 'La conexión no está configurada.');
    if ($path === '/api/auth/me' && $method === 'GET') respond(200, ['user' => public_user(auth_user())]);
    if ($method !== 'POST') throw new HttpError(405, 'Método no permitido.');
    check_origin();
    if ($path === '/api/auth/logout') {
        $token = $_COOKIE['rumbo_session'] ?? '';
        if (preg_match('/^[a-f0-9]{64}$/D', $token)) query('DELETE dbo.RumboSessions WHERE TokenHash=?', [hash('sha256', $token)])->closeCursor();
        set_cookie('rumbo_session', '', time() - 3600);
        // Start with a fresh guest after logout, never with the account's cached data.
        set_cookie('rumbo_visitor', '', time() - 3600);
        respond(200, ['ok' => true]);
    }
    if (!in_array($path, ['/api/auth/register', '/api/auth/login'], true)) throw new HttpError(404, 'Ruta no encontrada.');
    $body = request_body(4000);
    $email = is_string($body->email ?? null) ? strtolower(trim($body->email)) : '';
    $password = $body->password ?? null;
    if (strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password) || strlen($password) < 1 || strlen($password) > 128) throw new HttpError(400, 'Usa un correo válido y tu contraseña.');
    auth_rate_limit();
    if ($path === '/api/auth/login') {
        $user = query('SELECT * FROM dbo.RumboUsers WHERE Email=?', [$email])->fetch();
        $hash = $user['PasswordHash'] ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';
        if (!verify_password($password, $hash) || !$user) throw new HttpError(401, 'Correo o contraseña incorrectos.');
        issue_session($user['Id']);
        respond(200, ['user' => public_user($user)]);
    }
    $name = is_string($body->name ?? null) ? trim($body->name) : '';
    if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 120 || preg_match('/[\x00-\x1f\x7f]/', $name)) throw new HttpError(400, 'Escribe un nombre de 2 a 120 caracteres.');
    if (strlen($password) < 8 || strlen($password) > 72) throw new HttpError(400, 'La contraseña debe tener entre 8 y 72 bytes.');
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $guest = guest_owner();
    $connection = db(); $connection->beginTransaction();
    try {
        $owner = new_owner();
        $user = query('INSERT dbo.RumboUsers(Email,FullName,PasswordHash,VisitorId) OUTPUT INSERTED.Id,INSERTED.Email,INSERTED.FullName VALUES(?,?,?,?)', [$email, $name, $hash, $owner])->fetch();
        if ($guest) query('INSERT dbo.RumboVisitorState(VisitorId,StateKey,DataJson,Revision) SELECT ?,StateKey,DataJson,Revision FROM dbo.RumboVisitorState WHERE VisitorId=?', [$owner, $guest])->closeCursor();
        issue_session($user['Id']);
        $connection->commit();
        respond(201, ['user' => public_user($user)]);
    } catch (PDOException $e) {
        if ($connection->inTransaction()) $connection->rollBack();
        if (in_array((int)($e->errorInfo[1] ?? 0), [2601,2627], true)) throw new HttpError(409, 'No se pudo registrar ese correo. Si ya tienes cuenta, inicia sesión.');
        throw $e;
    } catch (Throwable $e) { if ($connection->inTransaction()) $connection->rollBack(); throw $e; }
}
