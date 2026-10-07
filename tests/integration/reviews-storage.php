<?php
require_once dirname(__DIR__,2).'/backend/php/community.php';
$connection=db();$connection->beginTransaction();
try {
 $key='00000000-0000-4000-8000-'.bin2hex(random_bytes(6));$user=['Id'=>$key,'FullName'=>'Verificación temporal'];
 persist_review($user,(object)['rating'=>4,'comment'=>'Prueba técnica sin publicación permanente.']);
 persist_review($user,(object)['rating'=>2,'comment'=>'Actualización técnica sin publicación permanente.']);
 $rows=query('SELECT DataJson FROM dbo.RumboSettings WHERE Name=?',['review:'.$key])->fetchAll();
 if(count($rows)!==1)throw new RuntimeException('Duplicate review');
 $data=json_decode($rows[0]['DataJson'],true,512,JSON_THROW_ON_ERROR);
 if($data['rating']!==2||$data['name']!=='Verificación')throw new RuntimeException('Review not updated');
 echo "PHP + Azure: guardado y actualización verificados; prueba revertida.\n";
}finally{$connection->rollBack();}
