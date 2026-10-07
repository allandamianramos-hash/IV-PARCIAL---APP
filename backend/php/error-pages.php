<?php
declare(strict_types=1);
function rumbo_error_page(int $status): never {
    $messages=[400=>['Enlace no válido.','Comprueba la dirección o vuelve al inicio para continuar.'],403=>['No se puede abrir esta página.','Accede desde la dirección de Rumbo para continuar.'],404=>['No encontramos esta página.','El enlace puede haber cambiado o la página ya no está disponible. Puedes seguir explorando desde el inicio.'],405=>['Esta acción no está disponible.','Vuelve al inicio y abre la sección que necesitas.'],500=>['No pudimos cargar esta página.','Ocurrió un problema en Rumbo. Vuelve a intentarlo en unos momentos.'],503=>['Rumbo no está disponible por un momento.','No pudimos completar la solicitud. Vuelve a intentarlo en unos momentos.']];
    [$title,$message]=$messages[$status] ?? $messages[500];
    http_response_code($status);header('Content-Type: text/html; charset=utf-8');header('Cache-Control: no-store');
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET')==='HEAD') exit;
    $html=file_get_contents(__DIR__.'/../../public/error.html');
    echo str_replace(['Página no encontrada | Rumbo','Error 404','>404<','No encontramos esta página.','El enlace puede haber cambiado o la página ya no está disponible. Puedes seguir explorando desde el inicio.','href="index.html"','href="servicios.html"','src="js/compartido/connection.js"','src="js/compartido/error.js"'],[htmlspecialchars($title).' | Rumbo','Error '.$status,'>'.$status.'<',htmlspecialchars($title),htmlspecialchars($message),'href="/index.html"','href="/servicios.html"','src="/js/compartido/connection.js"','src="/js/compartido/error.js"'],$html);
    exit;
}
