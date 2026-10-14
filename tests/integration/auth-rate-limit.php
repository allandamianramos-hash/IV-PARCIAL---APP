<?php
require dirname(__DIR__,2).'/backend/php/auth.php';
$bucket=$argv[1];
$ip=hash('sha256',gethostname().':local:'.$bucket);
try {
    auth_rate_limit($bucket,2);
    auth_rate_limit($bucket,2);
    try { auth_rate_limit($bucket,2); throw new RuntimeException('Expected HTTP 429'); }
    catch (HttpError $error) { if ($error->status!==429) throw $error; }
    if ((int)query('SELECT COUNT(*) FROM dbo.RumboAuthAttempts WHERE IpHash=?',[$ip])->fetchColumn()!==2) throw new RuntimeException('Unexpected attempts');
    echo "Attempt limit retained\n";
} finally { query('DELETE dbo.RumboAuthAttempts WHERE IpHash=?',[$ip])->closeCursor(); }

foreach (['google'=>'RumboGoogleChallenges','microsoft'=>'RumboMicrosoftChallenges'] as $provider=>$table) {
    $nonces=[];
    try {
        $first=oauth_challenge_nonce($provider,'');$nonces[]=$first;
        if (!preg_match('/^[a-f0-9]{64}$/D',$first)) throw new RuntimeException('Invalid challenge');
        if (oauth_challenge_nonce($provider,$first)!==$first) throw new RuntimeException('Live challenge not reused');
        query("DELETE dbo.$table WHERE NonceHash=?; INSERT dbo.$table(NonceHash,ExpiresAt) VALUES(?,DATEADD(minute,-1,SYSUTCDATETIME()));",[hash('sha256',$first),hash('sha256',$first)])->closeCursor();
        $renewed=oauth_challenge_nonce($provider,$first);$nonces[]=$renewed;
        if ($renewed===$first) throw new RuntimeException('Expired challenge reused');
    } finally { foreach ($nonces as $nonce) query("DELETE dbo.$table WHERE NonceHash=?",[hash('sha256',$nonce)])->closeCursor(); }
}
echo "OAuth challenge expiry retained\n";
