<?php
declare(strict_types=1);

// The identity comes exclusively from the server's JWT verifier.
function complete_social_account(string $provider, array $identity, stdClass $body, string $nonce): never {
    $process=proc_open([rumbo_config('NODE_BIN','node'),__DIR__.'/social-account.mjs'],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes,dirname(__DIR__,2),null,['bypass_shell'=>true]);
    if (!is_resource($process)) throw new HttpError(503,'No se pudo completar el acceso.');
    $input=['provider'=>$provider,'identity'=>$identity,'nonce'=>$nonce,'password'=>$body->password??null];
    if (property_exists($body,'newPassword')) $input['newPassword']=$body->newPassword;
    fwrite($pipes[0],encode_json($input));fclose($pipes[0]);
    $result=stream_get_contents($pipes[1]);fclose($pipes[1]);
    stream_get_contents($pipes[2]);fclose($pipes[2]);
    $code=proc_close($process);$result=json_decode($result,true);
    if ($code!==0 || !is_array($result) || !isset($result['status'])) throw new HttpError(503,'No se pudo completar el acceso.');
    if ($result['status']!==200) respond($result['status'],$result['data']);
    $account=$result['result'];
    issue_session($account['user']['Id'],$account['passwordHash']);
    set_cookie('rumbo_'.$provider.'_nonce','',time()-3600);
    set_cookie('rumbo_visitor','',time()-3600);
    respond($account['created']?201:200,['user'=>public_user($account['user'])]);
}
