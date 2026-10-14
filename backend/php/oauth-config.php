<?php
declare(strict_types=1);

// Reuse or issue the login challenge in one SQL request. Only these two
// server-owned table names can be interpolated; all values stay parameterized.
function oauth_challenge_nonce(string $provider, string $existing): string {
    $table=['google'=>'RumboGoogleChallenges','microsoft'=>'RumboMicrosoftChallenges'][$provider] ?? throw new RuntimeException('Proveedor OAuth desconocido.');
    $fresh=bin2hex(random_bytes(32));
    $statement=query("SET NOCOUNT ON;
        DECLARE @reuse int=0;
        IF EXISTS(SELECT 1 FROM dbo.$table WHERE NonceHash=? AND ExpiresAt>SYSUTCDATETIME()) SET @reuse=1;
        ELSE BEGIN
          DELETE dbo.$table WHERE ExpiresAt<=SYSUTCDATETIME();
          INSERT dbo.$table(NonceHash,ExpiresAt) VALUES(?,DATEADD(minute,10,SYSUTCDATETIME()));
        END;
        SELECT @reuse;",[hash('sha256',$existing),hash('sha256',$fresh)]);
    $reuse=(int)$statement->fetchColumn();$statement->closeCursor();
    return $reuse ? $existing : $fresh;
}

// The same public application identifiers are used by PHP and Node.
function oauth_client_id(string $key): string {
    static $defaults = null;
    $defaults ??= json_decode(file_get_contents(dirname(__DIR__, 2) . '/config/oauth-public.json'), true, 512, JSON_THROW_ON_ERROR);
    if (!array_key_exists($key, $defaults)) throw new RuntimeException('Proveedor OAuth desconocido.');
    $override = trim(rumbo_config($key));
    return $override !== '' ? $override : $defaults[$key];
}
