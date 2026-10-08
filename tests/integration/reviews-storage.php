<?php
require_once dirname(__DIR__,2).'/backend/php/community.php';
$connection=db();$connection->beginTransaction();
try {
 $key='00000000-0000-4000-8000-'.bin2hex(random_bytes(6));$user=['Id'=>$key,'FullName'=>'Verificación temporal'];
 $first=persist_review($user,(object)['rating'=>4,'comment'=>'Prueba técnica sin publicación permanente.']);
 $second=persist_review($user,(object)['rating'=>2,'comment'=>'Segunda reseña sin publicación permanente.']);
 $rows=query('SELECT DataJson FROM dbo.RumboSettings WHERE Name LIKE ?',['review:'.$key.':%'])->fetchAll();
 if(count($rows)!==2||$first===$second)throw new RuntimeException('Reviews must have separate IDs');
 query('DELETE FROM dbo.RumboSettings WHERE Name=?',[$first])->closeCursor();
 $rows=query('SELECT DataJson FROM dbo.RumboSettings WHERE Name LIKE ?',['review:'.$key.':%'])->fetchAll();
 if(count($rows)!==1)throw new RuntimeException('Only the selected review should be deleted');
 $data=json_decode($rows[0]['DataJson'],true,512,JSON_THROW_ON_ERROR);
 if($data['rating']!==2||$data['name']!=='Verificación')throw new RuntimeException('Remaining review changed');
 echo "PHP + Azure: publicaciones independientes y eliminación individual verificadas; prueba revertida.\n";
}finally{$connection->rollBack();}
