<?php
declare(strict_types=1);

// The same public application identifiers are used by PHP and Node.
function oauth_client_id(string $key): string {
    static $defaults = null;
    $defaults ??= json_decode(file_get_contents(dirname(__DIR__, 2) . '/config/oauth-public.json'), true, 512, JSON_THROW_ON_ERROR);
    if (!array_key_exists($key, $defaults)) throw new RuntimeException('Proveedor OAuth desconocido.');
    $override = trim(rumbo_config($key));
    return $override !== '' ? $override : $defaults[$key];
}
