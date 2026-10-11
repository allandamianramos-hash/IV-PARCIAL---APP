<?php
declare(strict_types=1);
function password_recovery(string $action): never {
    auth_rate_limit('password-recovery', 20);
    $body = request_body(4000);
    $process = proc_open([rumbo_config('NODE_BIN','node'),__DIR__.'/password-recovery.mjs'],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes,dirname(__DIR__,2),null,['bypass_shell'=>true]);
    if (!is_resource($process)) throw new HttpError(503,'La recuperación no está disponible.');
    fwrite($pipes[0],encode_json(['action'=>$action,'body'=>$body]));fclose($pipes[0]);
    $result=stream_get_contents($pipes[1]);fclose($pipes[1]);
    $diagnostic=stream_get_contents($pipes[2]);fclose($pipes[2]);
    $code=proc_close($process);$result=json_decode($result,true);
    if ($diagnostic!=='') error_log('Rumbo recovery: delivery or bridge error');
    if ($code!==0 || !is_array($result) || !isset($result['status'],$result['data'])) throw new HttpError(503,'No se pudo completar la recuperación.');
    respond((int)$result['status'],$result['data']);
}
