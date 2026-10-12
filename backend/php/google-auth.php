<?php
declare(strict_types=1);
require_once __DIR__ . '/oauth-config.php';

function google_client_id(): string {
    $id = oauth_client_id('GOOGLE_CLIENT_ID');
    return preg_match('/^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/D', $id) ? $id : '';
}

function google_nonce(): string {
    $nonce = $_COOKIE['rumbo_google_nonce'] ?? '';
    return is_string($nonce) && preg_match('/^[a-f0-9]{64}$/D', $nonce) ? $nonce : '';
}

function google_config(): never {
    $expected = rumbo_config('PHP_APP_ORIGIN') ?: 'http://' . ($_SERVER['HTTP_HOST'] ?? '');
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site' || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== $expected)) throw new HttpError(403, 'Origen no permitido.');
    $clientId = google_client_id();
    if ($clientId === '') respond(200, ['enabled' => false]);
    auth_rate_limit('config', 60);
    $nonce = google_nonce();
    if ($nonce === '' || !query('SELECT NonceHash FROM dbo.RumboGoogleChallenges WHERE NonceHash=? AND ExpiresAt>SYSUTCDATETIME()', [hash('sha256', $nonce)])->fetchColumn()) {
        $nonce = bin2hex(random_bytes(32));
        query('DELETE dbo.RumboGoogleChallenges WHERE ExpiresAt<=SYSUTCDATETIME()')->closeCursor();
        query('INSERT dbo.RumboGoogleChallenges(NonceHash,ExpiresAt) VALUES(?,DATEADD(minute,10,SYSUTCDATETIME()))', [hash('sha256', $nonce)])->closeCursor();
    }
    set_cookie('rumbo_google_nonce', $nonce, time() + 600);
    respond(200, ['enabled' => true, 'clientId' => $clientId, 'nonce' => $nonce]);
}

function verified_google_identity(stdClass $body): array {
    $nonce = google_nonce();
    if ($nonce === '' || !is_string($body->credential ?? null) || strlen($body->credential) > 12000) throw new HttpError(401, 'Recarga la página y vuelve a entrar con Google.');
    $process = proc_open([rumbo_config('NODE_BIN', 'node'), __DIR__ . '/verify-google.mjs'], [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']], $pipes, dirname(__DIR__, 2), null, ['bypass_shell'=>true]);
    if (!is_resource($process)) throw new HttpError(503, 'No se pudo iniciar la verificación de Google.');
    fwrite($pipes[0], encode_json(['credential'=>$body->credential, 'clientId'=>google_client_id(), 'nonce'=>$nonce])); fclose($pipes[0]);
    $result = stream_get_contents($pipes[1]); fclose($pipes[1]); fclose($pipes[2]);
    $code = proc_close($process);
    $identity = json_decode($result, true);
    if ($code !== 0 || !is_array($identity) || !isset($identity['sub'], $identity['email'], $identity['name'])) throw new HttpError(401, 'No se pudo verificar el acceso con Google. Recarga la página e inténtalo de nuevo.');
    return $identity;
}

function google_signin(): never {
    if (google_client_id() === '') throw new HttpError(503, 'Google todavía no está configurado.');
    auth_rate_limit();
    $body = request_body(32000);
    $identity = verified_google_identity($body);
    require_once __DIR__ . '/social-account.php';
    complete_social_account('google', $identity, $body, google_nonce());
}
