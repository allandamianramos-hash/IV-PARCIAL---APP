<?php
declare(strict_types=1);
function handle_analytics(string $path,string $method): never {
    $config=json_decode(file_get_contents(dirname(__DIR__,2).'/config/site-public.json'),true,512,JSON_THROW_ON_ERROR);
    if($path==='/api/site-config'){if($method!=='GET')throw new HttpError(405,'Método no permitido.');respond(200,$config);}
    if($method!=='POST')throw new HttpError(405,'Método no permitido.');
    check_origin();if(!$config['analyticsEnabled']){http_response_code(204);exit;}
    auth_rate_limit('analytics',120);$body=request_body(500);
    $pages=['index.html','tienda.html'];foreach(['servicios','traslados','seguros','guias','privacidad','terminos','cookies','cancelaciones','legal'] as $s)$pages[]='servicios:'.$s;foreach(['destinos','detalle-destino','vuelos','hoteles'] as $s)$pages[]='viajes:'.$s;
    if(($body->consent??false)!==true||!in_array($body->page??null,$pages,true)||array_diff(array_keys((array)$body),['page','consent']))throw new HttpError(400,'Datos inválidos.');
    $connection=db();$connection->beginTransaction();
    try{
        $updated=query('UPDATE dbo.RumboPageViews WITH(UPDLOCK,SERIALIZABLE) SET Views=Views+1 WHERE ViewDate=CAST(SYSUTCDATETIME() AS date) AND Page=?',[$body->page]);
        if($updated->rowCount()===0)query('INSERT dbo.RumboPageViews(ViewDate,Page,Views) VALUES(CAST(SYSUTCDATETIME() AS date),?,1)',[$body->page])->closeCursor();
        $updated->closeCursor();query('DELETE FROM dbo.RumboPageViews WHERE ViewDate<DATEADD(day,-90,CAST(SYSUTCDATETIME() AS date))')->closeCursor();$connection->commit();
    }catch(Throwable $e){if($connection->inTransaction())$connection->rollBack();throw $e;}
    http_response_code(204);exit;
}
