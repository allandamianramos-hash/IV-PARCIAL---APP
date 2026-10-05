<?php
declare(strict_types=1);
require_once __DIR__ . '/auth.php';

const STATE_KEYS = ['rumbo.store.cart.v2','rumbo.store.favorites.v2','rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.profile.v1','rumbo.checkout.v1','rumbo.no-flight.v1','rumbo.departureChecklist.v1'];
function short_text(mixed $v, int $max): bool { return is_string($v) && mb_strlen($v) <= $max; }
function bounded_integer(mixed $v, int $min, int $max): bool { return is_int($v) && $v >= $min && $v <= $max; }
function every(array $items, callable $predicate): bool { foreach ($items as $k => $v) if (!$predicate($v, $k)) return false; return true; }
function valid_state(string $key, mixed $v): bool {
    if (!in_array($key, STATE_KEYS, true)) return false;
    if ($v === null) return true;
    if (strlen(encode_json($v)) > 24000) return false;
    switch ($key) {
        case 'rumbo.store.cart.v2':
            return is_array($v) && count($v) <= 100 && every($v, fn($r) => $r instanceof stdClass && bounded_integer($r->id ?? null,1,1000000) && bounded_integer($r->quantity ?? null,1,99) && ($r->options ?? null) instanceof stdClass && count((array)$r->options) <= 10 && every((array)$r->options, fn($x,$k) => short_text($k,80) && short_text($x,100)));
        case 'rumbo.store.favorites.v2': return is_array($v) && count($v) <= 500 && every($v, fn($x) => bounded_integer($x,1,1000000));
        case 'rumbo.profile.v1': return $v instanceof stdClass && !array_diff(array_keys((array)$v), ['alias','preference']) && short_text($v->alias ?? null,40) && trim($v->alias) !== '' && in_array($v->preference ?? '',['playa','naturaleza','cultura'],true);
        case 'rumbo.departureChecklist.v1': return is_array($v) && count($v) <= 30 && every($v,fn($x) => short_text($x,100));
        case 'rumbo.no-flight.v1': return short_text($v,250);
        case 'rumbo.checkout.v1': return $v instanceof stdClass && ($v->demo ?? false) === true && short_text($v->signature ?? null,18000) && short_text($v->code ?? null,80) && short_text($v->date ?? null,40) && !array_diff(array_keys((array)$v), ['demo','signature','code','date']);
        case 'rumbo.services.v1':
            if (!is_array($v) || count($v) > 3) return false;
            $sections=[];
            foreach ($v as $s) {
                if (!$s instanceof stdClass || !in_array($s->section ?? '',['traslados','seguros','guias'],true) || in_array($s->section,$sections,true) || !short_text($s->title ?? null,200) || !short_text($s->detail ?? null,1000) || !is_numeric($s->total ?? null) || is_string($s->total) || $s->total < 0 || $s->total > 1e9 || !($s->values ?? null) instanceof stdClass || !every((array)$s->values,fn($x)=>short_text($x,200))) return false;
                $sections[]=$s->section;
            }
            return true;
        case 'rumbo.integrante2.viaje.v1':
            if (!$v instanceof stdClass) return false;
            foreach ((array)$v as $k=>$x) {
                if (in_array($k,['destinationId','origin','date','checkIn','cabin','flightId','hotelId','roomType'],true)) { if (!short_text($x,100)) return false; }
                else { $ranges=['travelers'=>[1,12],'nights'=>[1,30],'rooms'=>[1,6]]; if (!isset($ranges[$k]) || !bounded_integer($x,...$ranges[$k])) return false; }
            }
            return true;
    }
    return false;
}

function load_catalog(): array {
    $products=query('SELECT * FROM dbo.RumboProducts ORDER BY Id')->fetchAll();
    $destinations=query('SELECT * FROM dbo.RumboDestinations ORDER BY SortOrder')->fetchAll();
    $hotels=query('SELECT * FROM dbo.RumboHotels ORDER BY SortOrder')->fetchAll();
    if (!$products || !$destinations) throw new RuntimeException('Catálogo vacío. Ejecuta la instalación.');
    $catalog=[];
    foreach (query('SELECT * FROM dbo.RumboSettings')->fetchAll() as $row) $catalog[$row['Name']]=json_decode($row['DataJson'],false,512,JSON_THROW_ON_ERROR);
    $catalog['products']=[]; $catalog['productOptions']=new stdClass(); $catalog['priceAdjustments']=new stdClass();
    foreach ($products as $p) {
        $item=json_decode($p['DataJson'],true,512,JSON_THROW_ON_ERROR);
        $item['id']=(int)$p['Id'];$item['name']=$p['Name'];$item['price']=(float)$p['Price'];
        $catalog['products'][]=$item;
        $catalog['productOptions']->{(string)$p['Id']}=json_decode($p['OptionsJson'],false,512,JSON_THROW_ON_ERROR);
        $catalog['priceAdjustments']->{(string)$p['Id']}=json_decode($p['AdjustmentsJson'],false,512,JSON_THROW_ON_ERROR);
    }
    $catalog['destinations']=[];
    foreach ($destinations as $d) {
        $item=json_decode($d['DataJson'],true,512,JSON_THROW_ON_ERROR);
        $item['id']=$d['Id'];$item['name']=$d['Name'];$item['economy']=(float)$d['Economy'];$item['hotels']=[];
        foreach ($hotels as $h) if ($h['DestinationId']===$d['Id']) {
            $hotel=json_decode($h['DataJson'],true,512,JSON_THROW_ON_ERROR);
            $hotel['id']=$h['Id'];$hotel['name']=$h['Name'];$hotel['rate']=(float)$h['Rate'];$item['hotels'][]=$hotel;
        }
        $catalog['destinations'][]=$item;
    }
    return $catalog;
}

function read_state(string $id): object {
    $result=new stdClass();
    foreach (query('SELECT StateKey,DataJson,Revision FROM dbo.RumboVisitorState WHERE VisitorId=?',[$id])->fetchAll() as $row) $result->{$row['StateKey']}=['value'=>json_decode($row['DataJson'],false,512,JSON_THROW_ON_ERROR),'revision'=>(int)$row['Revision']];
    return $result;
}

function bootstrap_data(): array {
    if (rumbo_config('DB_ENABLED') !== 'true') return ['backend'=>'php','connected'=>false];
    try {
        $catalog=load_catalog();$user=auth_user();$id=$user['VisitorId'] ?? guest_owner(true);
        return ['backend'=>'php','connected'=>true,'visitor'=>$id,'user'=>public_user($user),'catalog'=>$catalog,'state'=>read_state($id)];
    } catch (Throwable $e) { error_log('Rumbo SQL: '.get_class($e));return ['backend'=>'php','connected'=>false,'reason'=>str_contains($e->getMessage(),'is not allowed to access the server')?'firewall':'unavailable']; }
}

function handle_data(string $path, string $method): never {
    if (rumbo_config('DB_ENABLED') !== 'true') throw new HttpError(503,'La conexión no está configurada.');
    if ($path==='/api/database' && $method==='GET') { query('SELECT TOP (1) Name FROM dbo.RumboMigrations')->closeCursor();respond(200,['connected'=>true,'backend'=>'php']); }
    if ($path==='/api/catalog' && $method==='GET') respond(200,load_catalog());
    if ($path!=='/api/state') throw new HttpError(404,'Ruta no encontrada.');
    if (!in_array($method,['GET','PUT'],true)) throw new HttpError(405,'Método no permitido.');
    if ($method==='PUT') check_origin();
    $id=state_owner();
    if (!$id) throw new HttpError(401,'Abre una página de Rumbo para iniciar tu sesión.');
    if ($method==='GET') respond(200,['state'=>read_state($id)]);
    if (strtolower($_SERVER['HTTP_X_RUMBO_VISITOR'] ?? '')!==strtolower($id)) throw new HttpError(409,'La sesión ha cambiado. Recarga antes de guardar.');
    $body=request_body();
    if (!($body->changes ?? null) instanceof stdClass || count((array)$body->changes)<1 || count((array)$body->changes)>count(STATE_KEYS)) throw new HttpError(400,'Selección inválida.');
    foreach ($body->changes as $key=>$change) if (!$change instanceof stdClass || !property_exists($change,'value') || !bounded_integer($change->revision ?? null,0,2147483646) || !valid_state($key,$change->value)) throw new HttpError(400,'Selección inválida.');
    $connection=db();$connection->beginTransaction();
    try {
        query('SELECT Id FROM dbo.RumboVisitors WITH(UPDLOCK,HOLDLOCK) WHERE Id=?',[$id])->closeCursor();
        $state=read_state($id);
        foreach ($body->changes as $key=>$change) if ($change->revision !== ($state->{$key}['revision'] ?? 0)) throw new HttpError(409,'Hay cambios más recientes. Recarga para revisarlos.');
        $revisions=[];
        foreach ($body->changes as $key=>$change) {
            if (isset($state->{$key})) query('UPDATE dbo.RumboVisitorState SET DataJson=?,Revision=Revision+1,UpdatedAt=SYSUTCDATETIME() WHERE VisitorId=? AND StateKey=?',[encode_json($change->value),$id,$key])->closeCursor();
            else query('INSERT dbo.RumboVisitorState(VisitorId,StateKey,DataJson) VALUES(?,?,?)',[$id,$key,encode_json($change->value)])->closeCursor();
            $revisions[$key]=$change->revision+1;
        }
        $connection->commit();respond(200,['revisions'=>$revisions]);
    } catch (Throwable $e) { if ($connection->inTransaction()) $connection->rollBack();throw $e; }
}
