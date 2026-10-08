<?php
declare(strict_types=1);
require_once __DIR__.'/datos.php';
function handle_reviews(string $method): never {
 if(!in_array($method,['GET','POST','DELETE'],true)) throw new HttpError(405,'Método no permitido.');
 if(rumbo_config('DB_ENABLED')!=='true') throw new HttpError(503,'Las reseñas no están disponibles. Inténtalo más tarde.');
 if($method==='GET') {
  $page=max(0,min(100000,(int)($_GET['page']??0)));$offset=$page*6;
  $user=auth_user();$ownKey=$user?'review:'.$user['Id']:'';
  $aggregate=query("SELECT COUNT(*) AS total,AVG(TRY_CAST(JSON_VALUE(DataJson,'$.rating') AS float)) AS average,MAX(CASE WHEN Name=? OR Name LIKE ? THEN 1 ELSE 0 END) AS hasOwnReview FROM dbo.RumboSettings WHERE Name LIKE 'review:%'",[$ownKey,$ownKey.':%'])->fetch();
  // Offset is a bounded integer, not raw user input.
  $rows=query("SELECT Name AS id,CASE WHEN Name=? OR Name LIKE ? THEN 1 ELSE 0 END AS isOwn,JSON_VALUE(DataJson,'$.name') AS name,TRY_CAST(JSON_VALUE(DataJson,'$.rating') AS int) AS rating,JSON_VALUE(DataJson,'$.comment') AS comment,JSON_VALUE(DataJson,'$.date') AS date FROM dbo.RumboSettings WHERE Name LIKE 'review:%' ORDER BY JSON_VALUE(DataJson,'$.date') DESC,Name OFFSET $offset ROWS FETCH NEXT 6 ROWS ONLY",[$ownKey,$ownKey.':%'])->fetchAll();
  foreach($rows as &$row){$row['rating']=(int)$row['rating'];$row['isOwn']=(int)$row['isOwn']===1;}unset($row);
  respond(200,['total'=>(int)$aggregate['total'],'average'=>$aggregate['average']===null?null:(float)$aggregate['average'],'hasOwnReview'=>(int)$aggregate['hasOwnReview']===1,'reviews'=>$rows,'page'=>$page]);
 }
 check_origin();$user=auth_user();if(!$user)throw new HttpError(401,$method==='DELETE'?'Inicia sesión para eliminar tu reseña.':'Inicia sesión para publicar tu reseña.');
 if($method==='DELETE') {
  $id=$_GET['id']??null;
  if(!is_string($id)||strlen($id)>80||!preg_match('/^review:[a-zA-Z0-9:-]+$/D',$id))throw new HttpError(400,'Selecciona la reseña que quieres eliminar.');
  // La reseña se selecciona por ID; su propietario se comprueba con la sesión.
  $ownKey='review:'.$user['Id'];
  $deleted=query('DELETE FROM dbo.RumboSettings OUTPUT DELETED.Name WHERE Name=? AND (Name=? OR Name LIKE ?)',[$id,$ownKey,$ownKey.':%']);
  $found=$deleted->fetchColumn();$deleted->closeCursor();
  if($found===false)throw new HttpError(404,'No se encontró esa reseña en tu cuenta.');
  respond(200,['deleted'=>true]);
 }
 $body=request_body(8000);
 if(!is_int($body->rating??null)||$body->rating<1||$body->rating>5||!is_string($body->comment??null)||mb_strlen(trim($body->comment))<10||mb_strlen(trim($body->comment))>1200||preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f]/',$body->comment))throw new HttpError(400,'Elige de 1 a 5 estrellas y escribe entre 10 y 1200 caracteres.');
 $id=persist_review($user,$body);
 respond(200,['saved'=>true,'id'=>$id]);
}
// Accepts only the authenticated identity resolved by handle_reviews.
function persist_review(array $user,stdClass $body): string {
 $review=['name'=>preg_split('/\s+/u',trim($user['FullName']))[0],'rating'=>$body->rating,'comment'=>trim($body->comment),'date'=>gmdate('Y-m-d\TH:i:s.000\Z')];
 $key='review:'.$user['Id'].':'.bin2hex(random_bytes(16));
 query('INSERT dbo.RumboSettings(Name,DataJson) VALUES(?,?)',[$key,encode_json($review)])->closeCursor();
 return $key;
}
function handle_exchange_rates(string $method): never {
 if($method!=='GET')throw new HttpError(405,'Método no permitido.');
 $cache=dirname(__DIR__,2).'/.runtime/exchange-rates.json';
 $cached=is_file($cache)?json_decode((string)file_get_contents($cache),true):null;
 if(is_array($cached)&&isset($cached['loaded'],$cached['rates'],$cached['date'])&&time()-(int)$cached['loaded']<86400)respond(200,['base'=>'HNL','rates'=>$cached['rates'],'date'=>$cached['date']]);
 $curl=curl_init('https://open.er-api.com/v6/latest/HNL');
 curl_setopt_array($curl,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>4,CURLOPT_TIMEOUT=>8,CURLOPT_FOLLOWLOCATION=>false]);
 $raw=curl_exec($curl);$status=(int)curl_getinfo($curl,CURLINFO_HTTP_CODE);curl_close($curl);
 $data=is_string($raw)?json_decode($raw,true):null;
 $currencies=['HNL','USD','MXN','EUR','GBP','CAD','BRL','JPY','KRW','CNY','AED','GTQ','CRC','COP','ARS','CLP','PEN'];
 if($status!==200||!is_array($data)||($data['result']??'')!=='success'||($data['base_code']??'')!=='HNL')throw new HttpError(503,'No se pudo consultar el tipo de cambio. Se mantienen los precios en lempiras.');
 $rates=[];foreach($currencies as $code){$rate=$data['rates'][$code]??null;if(!is_numeric($rate)||(float)$rate<=0)throw new HttpError(503,'El proveedor no devolvió tipos de cambio válidos.');$rates[$code]=(float)$rate;}
 $date=(string)($data['time_last_update_utc']??'');if(strtotime($date)===false)throw new HttpError(503,'La fecha del tipo de cambio no es válida.');
 if(is_dir(dirname($cache)))@file_put_contents($cache,encode_json(['loaded'=>time(),'rates'=>$rates,'date'=>$date]),LOCK_EX);
 respond(200,['base'=>'HNL','rates'=>$rates,'date'=>$date]);
}
