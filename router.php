<?php
declare(strict_types=1);
require_once __DIR__ . '/backend/php/datos.php';
$path=parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH);
$method=$_SERVER['REQUEST_METHOD'] ?? 'GET';
header('X-Content-Type-Options: nosniff');header('Referrer-Policy: strict-origin-when-cross-origin');header('Cache-Control: no-store');
try {
    $host=$_SERVER['HTTP_HOST'] ?? '';
    $origin=rumbo_config('PHP_APP_ORIGIN');
    $expected=$origin ? parse_url($origin,PHP_URL_HOST).(parse_url($origin,PHP_URL_PORT)?':'.parse_url($origin,PHP_URL_PORT):'') : null;
    if ($expected ? $host!==$expected : !preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/D',$host)) throw new HttpError(403,'Host no permitido.');
    if ($path==='/api/health') respond(200,['app'=>'rumbo-viajes','status'=>'ok','backend'=>'php']);
    if (str_starts_with($path,'/api/auth/')) handle_auth($path,$method);
    if (in_array($path,['/api/database','/api/catalog','/api/state'],true)) handle_data($path,$method);
    if ($path==='/api/chat') {
        if ($method!=='POST') throw new HttpError(405,'Método no permitido.');
        check_origin();$body=request_body(32000);
        // Only the existing AI assistant is proxied. All database and user operations are PHP.
        $port=(int)rumbo_config('PORT','3000');
        $curl=curl_init("http://127.0.0.1:$port/api/chat");
        curl_setopt_array($curl,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>encode_json($body),CURLOPT_HTTPHEADER=>['Content-Type: application/json'],CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>2,CURLOPT_TIMEOUT=>35,CURLOPT_FOLLOWLOCATION=>false]);
        $response=curl_exec($curl);$status=(int)curl_getinfo($curl,CURLINFO_HTTP_CODE);curl_close($curl);
        if ($response===false || !$status) throw new HttpError(503,'Rumbito no está disponible. Puedes continuar organizando tu viaje.');
        http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo $response;exit;
    }
    if (!in_array($method,['GET','HEAD'],true)) throw new HttpError(405,'Método no permitido.');
    $file=rawurldecode(ltrim($path,'/')) ?: 'index.html';
    $public=['index.html','script.js','chat-engine.js','chat-client.js','chat-ui.js','chat.css','style.css','viajes.html','viajes.js','viajes.css','tienda.html','tienda.js','tienda.css','logo-rumbo.jpg','servicios.html','servicios.js','servicios.css','common.js','common.css','journey.js','promociones.css','design.css','database-client.js','registro.html','iniciar-sesion.html','auth-client.js','auth.css','guias-catalogo.js'];
    if (!in_array($file,$public,true) && !preg_match('~^(imagenes|imagenes-viajes)/[a-zA-Z0-9_-]+\.(jpg|png|webp)$~D',$file)) throw new HttpError(404,'Archivo no encontrado.');
    $absolute=__DIR__.'/public/'.$file;
    if (!is_file($absolute)) throw new HttpError(404,'Archivo no encontrado.');
    $ext=pathinfo($file,PATHINFO_EXTENSION);
    $mime=['html'=>'text/html; charset=utf-8','js'=>'text/javascript; charset=utf-8','css'=>'text/css; charset=utf-8','jpg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp'];
    header('Content-Type: '.$mime[$ext]);
    if ($method==='HEAD') exit;
    if ($ext==='html') echo str_replace('<head>','<head><script id="rumbo-bootstrap" type="application/json">'.encode_json(bootstrap_data()).'</script><script src="auth-client.js" defer></script><link rel="stylesheet" href="auth.css">',file_get_contents($absolute));
    else readfile($absolute);
} catch (HttpError $e) { respond($e->status,['error'=>$e->getMessage()]); }
catch (Throwable $e) { error_log('Rumbo: '.get_class($e).' '.(string)$e->getCode());respond(503,['error'=>'No se pudo completar la operación. Revisa la conexión a SQL Server.']); }
