<?php
declare(strict_types=1);
require_once __DIR__.'/datos.php';
function demo_quote(string $kind, object $state, array $catalog): array {
    $process=proc_open([rumbo_config('NODE_BIN','node'),dirname(__DIR__).'/node/checkout-quote.mjs'],[0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']],$pipes,dirname(__DIR__,2),null,['bypass_shell'=>true]);
    if(!is_resource($process))throw new HttpError(503,'No se pudo preparar el pago.');
    fwrite($pipes[0],encode_json(compact('kind','state','catalog')));fclose($pipes[0]);
    $output=stream_get_contents($pipes[1]);fclose($pipes[1]);stream_get_contents($pipes[2]);fclose($pipes[2]);$code=proc_close($process);
    $result=json_decode($output,true);
    if($code!==0||!is_array($result))throw new HttpError(503,'No se pudo preparar el pago.');
    if(isset($result['error']))throw new HttpError($result['status'],$result['error']);
    return $result['quote'];
}
function order_record(array $row): array {return array_merge(json_decode($row['DataJson'],true,512,JSON_THROW_ON_ERROR),['id'=>(string)$row['Id']]);}
function handle_orders(string $path,string $method): never {
    if($path==='/api/orders'?$method!=='GET':!in_array($method,['GET','POST'],true))throw new HttpError(405,'Método no permitido.');
    if($method==='POST')check_origin();
    $user=auth_user();if(!$user)throw new HttpError(401,'Inicia sesión para guardar tus compras.');
    if($path==='/api/orders'){
        $kind=$_GET['kind']??'all';$before=$_GET['before']??'9223372036854775807';
        if(!in_array($kind,['all','trip','store'],true)||!preg_match('/^\d{1,19}$/D',$before)||strlen($before)===19&&strcmp($before,'9223372036854775807')>0)throw new HttpError(400,'Filtro inválido.');
        $rows=query("SELECT TOP(21) Id,DataJson FROM dbo.RumboOrders WHERE UserId=? AND Id<CAST(? AS bigint) AND (?='all' OR Kind=?) ORDER BY Id DESC",[$user['Id'],$before,$kind,$kind])->fetchAll();
        respond(200,['orders'=>array_map('order_record',array_slice($rows,0,20)),'next'=>count($rows)>20?(string)$rows[19]['Id']:null]);
    }
    $body=null;$kind=$_GET['kind']??'';
    if($method==='POST'){
        $body=request_body(1500);$kind=$body->kind??'';
        if(array_diff(array_keys((array)$body),['kind','fingerprint'])||!is_string($body->fingerprint??null)||!preg_match('/^[a-f0-9]{64}$/D',$body->fingerprint))throw new HttpError(400,'Solicitud inválida.');
    }
    if(!in_array($kind,['trip','store'],true))throw new HttpError(400,'Tipo de compra inválido.');
    $catalog=load_catalog();$connection=db();$connection->beginTransaction();
    try{
        query('SELECT Id FROM dbo.RumboVisitors WITH(UPDLOCK,HOLDLOCK) WHERE Id=?',[$user['VisitorId']])->closeCursor();
        if($body){
            $previous=query('SELECT Id,DataJson FROM dbo.RumboOrders WHERE UserId=? AND Kind=? AND Fingerprint=?',[$user['Id'],$kind,$body->fingerprint])->fetch();
            if($previous){$connection->commit();respond(200,['order'=>order_record($previous)]);}
        }
        $quote=demo_quote($kind,read_state($user['VisitorId']),$catalog);
        if(!$body){$connection->commit();respond(200,['quote'=>$quote]);}
        if(!hash_equals($quote['fingerprint'],$body->fingerprint))throw new HttpError(409,'Tu selección ha cambiado. Cierra y vuelve a revisar el pago.');
        $order=array_merge($quote,['code'=>'RMB-'.strtoupper(bin2hex(random_bytes(16))),'date'=>gmdate('Y-m-d\TH:i:s\Z'),'status'=>'simulated','policyVersion'=>'2026-10-17']);
        $id=query('INSERT dbo.RumboOrders(UserId,Kind,Fingerprint,DataJson) OUTPUT INSERTED.Id VALUES(?,?,?,?)',[$user['Id'],$kind,$quote['fingerprint'],encode_json($order)])->fetchColumn();
        $connection->commit();respond(201,['order'=>array_merge($order,['id'=>(string)$id])]);
    }catch(Throwable $e){if($connection->inTransaction())$connection->rollBack();throw $e;}
}
