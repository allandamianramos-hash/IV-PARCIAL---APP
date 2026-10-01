<?php
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (($argv[1] ?? '') === 'driver') exit(extension_loaded('pdo_sqlsrv') ? 0 : 1);
echo PHP_MAJOR_VERSION, '.', PHP_MINOR_VERSION, '/', PHP_ZTS, '/', PHP_INT_SIZE;
