<?php
declare(strict_types=1);
require_once __DIR__ . '/oauth-config.php';

function microsoft_client_id(): string {
    $id = oauth_client_id('MICROSOFT_CLIENT_ID');
    return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iD', $id) ? $id : '';
}

function microsoft_nonce(): string {
    $nonce = $_COOKIE['rumbo_microsoft_nonce'] ?? '';
    return is_string($nonce) && preg_match('/^[a-f0-9]{64}$/D', $nonce) ? $nonce : '';
}

function microsoft_config(): never {
    $expected = rumbo_config('PHP_APP_ORIGIN') ?: 'http://' . ($_SERVER['HTTP_HOST'] ?? '');
    if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site' || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== $expected)) throw new HttpError(403, 'Origen no permitido.');
    $clientId = microsoft_client_id();
    if ($clientId === '') respond(200, ['enabled' => false]);
    auth_rate_limit('config', 60);
    $nonce = oauth_challenge_nonce('microsoft',microsoft_nonce());
    set_cookie('rumbo_microsoft_nonce', $nonce, time() + 600);
    respond(200, ['enabled' => true, 'clientId' => $clientId, 'nonce' => $nonce]);
}

function verified_microsoft_identity(stdClass $body): array {
    $nonce = microsoft_nonce();
    if ($nonce === '' || !is_string($body->credential ?? null) || strlen($body->credential) > 12000) throw new HttpError(401, 'Recarga la página y vuelve a entrar con Microsoft.');
    $process = proc_open([rumbo_config('NODE_BIN', 'node'), __DIR__ . '/verify-microsoft.mjs'], [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']], $pipes, dirname(__DIR__, 2), null, ['bypass_shell'=>true]);
    if (!is_resource($process)) throw new HttpError(503, 'No se pudo iniciar la verificación de Microsoft.');
    fwrite($pipes[0], encode_json(['credential'=>$body->credential, 'clientId'=>microsoft_client_id(), 'nonce'=>$nonce])); fclose($pipes[0]);
    $result = stream_get_contents($pipes[1]); fclose($pipes[1]);
    $diagnostic = stream_get_contents($pipes[2], 100); fclose($pipes[2]);
    $code = proc_close($process);
    $identity = json_decode($result, true);
    if ($code !== 0 || !is_array($identity) || !isset($identity['sub'], $identity['name'])) {
        error_log('Rumbo Microsoft: ' . preg_replace('/[^A-Z_]/', '', $diagnostic));
        throw new HttpError(401, 'No se pudo verificar el acceso con Microsoft. Recarga la página e inténtalo de nuevo.');
    }
    return $identity;
}

function microsoft_signin(): never {
    if (microsoft_client_id() === '') throw new HttpError(503, 'Microsoft todavía no está configurado.');
    auth_rate_limit();
    $body = request_body(32000);
    $identity = verified_microsoft_identity($body);
    require_once __DIR__ . '/social-account.php';
    complete_social_account('microsoft', $identity, $body, microsoft_nonce());
}
