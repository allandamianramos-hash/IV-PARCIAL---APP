<?php
declare(strict_types=1);
ini_set('display_errors','0');
require_once __DIR__ . '/backend/php/error-pages.php';
$path=parse_url($_SERVER['REQUEST_URI'] ?? '/',PHP_URL_PATH);
$method=$_SERVER['REQUEST_METHOD'] ?? 'GET';
header('X-Content-Type-Options: nosniff');header('Referrer-Policy: strict-origin-when-cross-origin');header('Cache-Control: no-store');
try {
    require_once __DIR__ . '/backend/php/datos.php';
    $host=$_SERVER['HTTP_HOST'] ?? '';
    $origin=rumbo_config('PHP_APP_ORIGIN');
    $expected=$origin ? parse_url($origin,PHP_URL_HOST).(parse_url($origin,PHP_URL_PORT)?':'.parse_url($origin,PHP_URL_PORT):'') : null;
    if ($expected ? $host!==$expected : !preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/D',$host)) throw new HttpError(403,'Host no permitido.');
    if ($path==='/api/health') {
        if (!in_array($method,['GET','HEAD'],true)) throw new HttpError(405,'Método no permitido.');
        $requestOrigin=$_SERVER['HTTP_ORIGIN'] ?? '';
        if (preg_match('~^http://(localhost|127\.0\.0\.1)(:\d+)?$~D',$requestOrigin)) { header('Access-Control-Allow-Origin: '.$requestOrigin);header('Vary: Origin'); }
        if ($method==='HEAD') { header('Content-Type: application/json');exit; }
        respond(200,['app'=>'rumbo-viajes','status'=>'ok','backend'=>'php']);
    }
    if(in_array($path,['/api/reviews','/api/exchange-rates'],true)){
        require_once __DIR__.'/backend/php/community.php';
        if($path==='/api/reviews')handle_reviews($method);
        handle_exchange_rates($method);
    }
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
    $assetAliases=json_decode(file_get_contents(__DIR__.'/config/asset-aliases.json'),true,512,JSON_THROW_ON_ERROR);
    $file=$assetAliases[$file]??$file;
    $public=['error.html','js/compartido/error.js','js/compartido/connection.js','index.html','js/inicio/script.js','js/rumbito/chat-engine.js','js/rumbito/chat-client.js','js/rumbito/chat-ui.js','css/rumbito/chat.css','css/inicio/style.css','viajes.html','js/destinos/viajes.js','css/destinos/viajes.css','tienda.html','js/tienda/tienda.js','css/tienda/tienda.css','servicios.html','js/servicios/servicios.js','css/servicios/servicios.css','js/compartido/common.js','css/compartido/common.css','js/servicios/journey.js','css/inicio/promociones.css','css/compartido/design.css','js/compartido/database-client.js','registro.html','iniciar-sesion.html','js/cuenta/auth-client.js','css/cuenta/auth.css','js/destinos/guias-catalogo.js'];
    array_push($public,'js/inicio/hero.js','css/inicio/hero.css','js/compartido/navigation.js','css/compartido/navigation.css','css/compartido/palette.css','css/comunidad/community.css','js/comunidad/reviews.js','js/idiomas/translations.js','js/idiomas/preferences.js','js/compartido/api-client.js');
    $public[]='js/idiomas/locale-engine.js';foreach(['es','en','de','fr','it','pt','ja','ko','zh','ar'] as $lang)$public[]='locales/'.$lang.'.json';
    if (!in_array($file,$public,true) && !preg_match('~^(imagenes|imagenes-viajes)(?:/[a-zA-Z0-9_-]+)+\.(jpg|png|webp)$~D',$file)) throw new HttpError(404,'Archivo no encontrado.');
    $absolute=__DIR__.'/public/'.$file;
    if (!is_file($absolute)) throw new HttpError(404,'Archivo no encontrado.');
    $ext=pathinfo($file,PATHINFO_EXTENSION);
    $mime=['html'=>'text/html; charset=utf-8','js'=>'text/javascript; charset=utf-8','css'=>'text/css; charset=utf-8','jpg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp','json'=>'application/json; charset=utf-8'];
    header('Content-Type: '.$mime[$ext]);
    if ($method==='HEAD') exit;
    if ($file==='error.html') { readfile($absolute);exit; }
    if ($ext==='html') echo str_replace('<head>','<head><script id="rumbo-bootstrap" type="application/json">'.encode_json(bootstrap_data()).'</script><script src="js/cuenta/auth-client.js" defer></script><link rel="stylesheet" href="css/cuenta/auth.css">',file_get_contents($absolute));
    else readfile($absolute);
} catch (HttpError $e) {
    if (!str_starts_with((string)$path,'/api/')) rumbo_error_page($e->status);
    respond($e->status,['error'=>$e->getMessage()]);
}
catch (Throwable $e) {
    error_log('Rumbo: '.get_class($e).' '.(string)$e->getCode());
    if (!str_starts_with((string)$path,'/api/')) rumbo_error_page(503);
    http_response_code(503);header('Content-Type: application/json; charset=utf-8');
    echo '{"error":"Rumbo no pudo completar la operación. Intenta de nuevo en unos momentos."}';
}
