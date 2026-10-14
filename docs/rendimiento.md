# Rendimiento de navegación — 14 de octubre de 2026

La demora principal estaba en el servidor PHP: cada página volvía a transferir el catálogo completo desde SQL antes de entregar HTML. Las mediciones iniciales de respuesta fueron 9,78 s en Destinos y 6,41 s en Iniciar sesión. Todos los recursos se entregaban con `no-store` y sin compresión.

## Cambios

- PHP guarda únicamente las filas públicas del catálogo en `.runtime/catalog-cache`. En cada petición SQL calcula una huella SHA-256 de los datos ordenados; si cambian, devuelve una nueva copia comprimida. Así se detectan inmediatamente modificaciones de precios y contenido, sin depender de un plazo de caducidad. Las sesiones, las contraseñas y las selecciones personales no se guardan en esta caché. Una caída de SQL sigue notificándose.
- PHP y Node comprimen HTML, JavaScript y CSS con gzip. Los archivos estáticos usan ETag y revalidación: si no cambiaron, responden 304 sin reenviar el contenido. Un cambio de bytes invalida la caché aunque el tamaño sea el mismo. HTML y respuestas de cuentas mantienen `no-store`.
- La limitación de intentos y la emisión de desafíos de Google/Microsoft agrupan sus operaciones SQL en menos solicitudes. Se mantienen los límites, los bloqueos, las fechas de expiración, las cookies y el coste de bcrypt.
- No se modificaron las fotografías, los estilos ni el contenido visual. La compresión HTTP se comprueba comparando los bytes descomprimidos con los originales.

## Mediciones locales

Con el catálogo reutilizable, las últimas tres respuestas de Destinos fueron 601, 485 y 480 ms; Iniciar sesión, 471, 485 y 472 ms; Registro, 474, 468 y 473 ms. Son tiempos de respuesta del servidor, no una garantía de carga total: SQL remoto, recursos externos y solicitudes simultáneas pueden añadir demora. Se observaron solicitudes aisladas de aproximadamente 2,7 s y la primera reconstrucción del catálogo puede tardar más.

El HTML de Destinos pasa de 243.181 a aproximadamente 44.244 bytes (82 % menos). `guias-catalogo.js` pasa de 739.244 a 97.445 bytes (87 % menos), y `viajes.js` de 382.402 a 63.750 bytes (83 % menos). Las imágenes conservan sus bytes originales.

## Validación

- `npm test`: 152 pruebas aprobadas.
- `npm run build`: compilación correcta.
- `node --test tests/integration/php.test.mjs`: registro, login, guardado, aislamiento y compatibilidad aprobados contra PHP y SQL.
- `node --test tests/integration/performance.test.mjs`: compresión, 304, actualización inmediata del catálogo, límites de acceso y renovación de desafíos caducados aprobados.
- `node --test tests/browser/history-position.test.mjs`: cuatro pruebas aprobadas en escritorio y móvil contra el servidor conectado; se conservan posición, filtros y detalles al volver.

Los servidores locales PHP y Node quedaron sirviendo estas mejoras. No se requiere migración de base de datos.
