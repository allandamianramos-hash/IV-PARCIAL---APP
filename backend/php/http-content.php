<?php
declare(strict_types=1);

function send_content(string $body, string $type, bool $cacheable = false): never {
    $encodings=[];
    foreach (explode(',', $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '') as $part) {
        $pieces=explode(';',trim($part));$quality=1.0;
        foreach (array_slice($pieces,1) as $parameter) if (preg_match('/^\s*q=([0-9.]+)\s*$/',$parameter,$match)) $quality=(float)$match[1];
        $encodings[strtolower(trim($pieces[0]))]=$quality;
    }
    $zipped=strlen($body)>=1024 && preg_match('~^(text/|application/json)~',$type) && ($encodings['gzip'] ?? $encodings['*'] ?? 0)>0;
    header('Content-Type: '.$type);
    header('Vary: Accept-Encoding');
    header('Cache-Control: '.($cacheable?'public, max-age=0, must-revalidate':'no-store'));
    if ($zipped) header('Content-Encoding: gzip');
    if ($cacheable) {
        $etag='"'.hash('sha256',$body).($zipped?'-gzip':'').'"';
        header('ETag: '.$etag);
        foreach (explode(',',$_SERVER['HTTP_IF_NONE_MATCH'] ?? '') as $tag) {
            if (trim($tag)==='*' || preg_replace('~^W/~','',trim($tag))===$etag) { http_response_code(304);exit; }
        }
    }
    $payload=$zipped?gzencode($body,6):$body;
    header('Content-Length: '.strlen($payload));
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET')!=='HEAD') echo $payload;
    exit;
}
