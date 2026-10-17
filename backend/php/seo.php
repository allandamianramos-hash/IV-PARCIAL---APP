<?php
declare(strict_types=1);
function seo_config(): array {static $config=null;return $config??=json_decode(file_get_contents(dirname(__DIR__,2).'/config/site-public.json'),true,512,JSON_THROW_ON_ERROR);}
function seo_pages(): array {static $pages=null;return $pages??=json_decode(file_get_contents(dirname(__DIR__,2).'/config/seo-pages.json'),true,512,JSON_THROW_ON_ERROR);}
function seo_escape(string $v): string{return htmlspecialchars($v,ENT_QUOTES|ENT_XML1,'UTF-8');}
function seo_origin(): string {
    $value=seo_config()['origin']?:rumbo_config('PHP_APP_ORIGIN');$parts=parse_url($value);
    return $parts&&($parts['scheme']??'')==='https'&&isset($parts['host'])&&in_array($parts['path']??'',['','/'],true)&&!isset($parts['query'])&&!isset($parts['fragment'])&&!isset($parts['user'])&&!isset($parts['pass'])?rtrim($value,'/'):'';
}
function seo_html(string $html,string $request): string {
    $parts=parse_url($request);parse_str($parts['query']??'',$params);$file=ltrim($parts['path'],'/')?:'index.html';$key=$file;
    if($file==='viajes.html'){$view=$params['pantalla']??'destinos';if(!is_string($view))$view='';$key.='?pantalla='.$view;if($view==='detalle-destino')$key.='&destino='.(is_string($params['destino']??null)?$params['destino']:'');}
    if($file==='servicios.html'&&isset($params['seccion'])&&$params['seccion']!=='servicios')$key.='?seccion='.(is_string($params['seccion'])?$params['seccion']:'');
    $page=seo_pages()[$key]??null;$origin=seo_origin();$indexable=$page&&$origin&&seo_config()['indexable'];
    $meta=$page??['title'=>'Mi cuenta | Rumbo','description'=>'Accede a tu espacio personal de Rumbo.'];
    if($page){$html=preg_replace_callback('~<title>[^<]*</title>~i',fn()=>'<title>'.seo_escape($page['title']).'</title>',$html);$html=preg_replace_callback('~<meta\s+name="description"\s+content="[^"]*"\s*/?>~i',fn()=>'<meta name="description" content="'.seo_escape($page['description']).'">',$html);}
    $tags='<meta name="robots" content="'.($indexable?'index,follow':'noindex,nofollow').'"><meta property="og:type" content="website"><meta property="og:site_name" content="Rumbo"><meta property="og:title" content="'.seo_escape($meta['title']).'"><meta property="og:description" content="'.seo_escape($meta['description']).'"><meta name="twitter:card" content="summary_large_image">';
    if($origin&&$page){$canonical=$origin.'/'.($key==='index.html'?'':$key);$image=$origin.'/'.($page['image']??'imagenes-viajes/portadas/hero-premium-venecia.jpg');$tags.='<link rel="canonical" href="'.seo_escape($canonical).'"><meta property="og:url" content="'.seo_escape($canonical).'"><meta property="og:image" content="'.seo_escape($image).'"><meta property="og:image:alt" content="'.seo_escape($page['imageAlt']??'El Gran Canal de Venecia · Rumbo').'"><meta name="twitter:image" content="'.seo_escape($image).'">';}
    return str_replace('</head>',$tags.'</head>',$html);
}
function seo_endpoint(string $path,string $method): void {
    if(!in_array($path,['/robots.txt','/sitemap.xml'],true))return;
    if(!in_array($method,['GET','HEAD'],true))throw new HttpError(405,'Método no permitido.');
    $origin=seo_origin();$published=$origin&&seo_config()['indexable'];header('Cache-Control: no-cache');
    if($path==='/robots.txt'){header('Content-Type: text/plain; charset=utf-8');$body=$published?"User-agent: *\nDisallow: /api/\nSitemap: $origin/sitemap.xml\n":"User-agent: *\nDisallow: /\n";}
    else{header('Content-Type: application/xml; charset=utf-8');if(!$published){http_response_code(503);$body='<?xml version="1.0" encoding="UTF-8"?><error>El dominio público y la indexación aún no están configurados.</error>';}
    else{$body='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';foreach(array_keys(seo_pages()) as $key)$body.='<url><loc>'.seo_escape($origin.'/'.($key==='index.html'?'':$key)).'</loc></url>';$body.='</urlset>';}}
    if($method!=='HEAD')echo $body;exit;
}
