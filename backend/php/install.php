<?php
declare(strict_types=1);
if (PHP_SAPI!=='cli') {http_response_code(404);exit;}
require_once __DIR__.'/conexion.php';
try {
    if (($argv[1] ?? '')==='check' || rumbo_config('DB_SETUP_MODE')==='check') {
        if (rumbo_config('DB_ENABLED') !== 'true') throw new RuntimeException('Activa DB_ENABLED=true en .env.');
        $row=query('SELECT DB_NAME() AS BaseDeDatos, SUSER_SNAME() AS UsuarioSQL')->fetch();
        require_once __DIR__.'/datos.php';
        $catalog=load_catalog();
        query('SELECT TOP (1) Id FROM dbo.RumboUsers')->closeCursor();
        query('SELECT TOP (1) TokenHash FROM dbo.RumboSessions')->closeCursor();
        query('SELECT TOP (1) Id FROM dbo.RumboAuthAttempts')->closeCursor();
        $checkConnection=db();$checkConnection->beginTransaction();
        try {
            $id=new_owner();
            query('INSERT dbo.RumboVisitorState(VisitorId,StateKey,DataJson) VALUES(?,?,?)',[$id,'rumbo.profile.v1',encode_json(['alias'=>'Comprobacion temporal','preference'=>'cultura'])])->closeCursor();
            $saved=read_state($id);
            if (!isset($saved->{'rumbo.profile.v1'})) throw new RuntimeException('No se pudo verificar la escritura.');
        } finally { $checkConnection->rollBack(); }
        $row['LecturaYEscritura']='OK';$row['Productos']=count($catalog['products']);
        echo encode_json($row).PHP_EOL;exit;
    }
    $connection=db('master');
    $script=file_get_contents(dirname(__DIR__, 2).'/database/INSTALAR_BD_VIAJES.sql');
    foreach (preg_split('/^GO\s*$/mi',$script) as $batch) if (trim($batch)!=='') $connection->exec($batch);
    echo "Base BD_VIAJES preparada. Se conservaron los datos existentes.\n";
} catch (Throwable $e) {
    if (isset($connection)) {try{$connection->exec('IF @@TRANCOUNT>0 ROLLBACK TRANSACTION');}catch(Throwable){}}
    fwrite(STDERR,'No se pudo preparar SQL Server: '.$e->getMessage().PHP_EOL);exit(1);
}
