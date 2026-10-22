# Publicar y actualizar Rumbo en Hostinger

Rumbo se publica como aplicación **Node.js**, con el backend existente y la base Azure SQL. El asistente de migración de respaldos PHP no configura esta aplicación. Los archivos de Windows, XAMPP, SQL administrativo, capturas y `.env` no forman parte del paquete público.

## Actualizaciones posteriores

1. Editar el proyecto de esta carpeta y comprobar los cambios.
2. Ejecutar `PREPARAR-HOSTINGER.cmd`. Compila la portada y el acceso Microsoft, genera metadatos, ejecuta las pruebas y prepara un ZIP de producción dentro de `.runtime/hostinger/`. Comprueba el espacio libre antes de copiar el proyecto; cada paquete completo ocupa aproximadamente 481 MB, además de la carpeta de preparación.
3. En Hostinger, abrir la **misma aplicación** y usar **Redeploy** con el ZIP nuevo. Conservar sus variables privadas y dominio. No crear otra aplicación en cada actualización.
4. Usar el preset **Other**, Node **22.x**, gestor **npm**, comando `npm run build`, salida `.`, entrada **`hostinger.mjs`**.
5. Esperar el resultado del despliegue y probar portada, registro, acceso, guardado, carrito, pago, historial y recuperación en la dirección pública.

La base de datos permanece en Azure: volver a desplegar el código no reemplaza ni borra cuentas o compras. Las modificaciones de estructura requieren una migración SQL revisada. Los recibos anteriores conservan su referencia y su contenido.

La entrada `hostinger.mjs` es necesaria: Hostinger importa el módulo de inicio y sirve archivos de `public/` directamente. Al arrancar, se trasladan las plantillas HTML a `templates/` para que pasen por Node y reciban sesión, catálogo y metadatos. Los recursos estáticos siguen en `public/`. El servidor local continúa usando `server.mjs`, sin trasladar sus HTML. No sustituir esta entrada por `server.mjs` ni volver a copiar HTML directamente a `public/` de una instancia en ejecución.

## Variables privadas del servidor

Configurar `NODE_ENV=production`, `HOST=0.0.0.0`, `APP_ORIGIN` con la dirección HTTPS exacta y sin barra final. Dejar que Hostinger asigne `PORT`.

La conexión usa `DB_ENABLED=true`, `DB_AUTH=sql`, `DB_SERVER`, `DB_NAME`, `DB_PORT=1433`, `DB_USER`, `DB_PASSWORD` y `DB_TRUST_CERTIFICATE=false`. Utilizar la cuenta de aplicación. **No copiar `AZURE_SQL_PASSWORD` ni credenciales administrativas.**

Para recuperar contraseñas se requieren las variables `MAIL_SMTP_*`, `MAIL_FROM`, `MAIL_FROM_NAME` y `MAIL_RESET_SECRET`. Para IA se usan `GROQ_API_KEY` y `GROQ_MODEL` (por defecto `openai/gpt-oss-20b`). Estas variables se guardan en el apartado privado de Hostinger; nunca en HTML, JavaScript del navegador, capturas o Git.

## Dominio y accesos sociales

La dirección publicada el 18 de octubre de 2026 es **https://grey-eel-517422.hostingersite.com**. El propietario no compró un dominio propio. La aplicación Node responde por HTTPS y la conexión a Azure SQL fue comprobada desde Hostinger.

Se guardaron el origen HTTPS en el cliente Google existente y el retorno SPA `https://grey-eel-517422.hostingersite.com/microsoft-callback.html` en «Rumbo Web» de Microsoft, conservando las direcciones locales y permisos de identidad existentes. El propietario confirmó el acceso real con ambos proveedores desde la web publicada. Microsoft también mostró «Cuenta de Microsoft verificada» antes de solicitar la contraseña propia de Rumbo.

Al conectar un dominio propio, actualizar `APP_ORIGIN`, añadir el origen HTTPS exacto a Google y registrar `https://DOMINIO/microsoft-callback.html` como retorno SPA en Microsoft. Mantener los permisos de identidad existentes; no se necesitan permisos de correo o archivos.

La dirección temporal conserva `indexable: false` para evitar indexar una dirección provisional. Al elegir la dirección definitiva, completar `origin` e `indexable` en `config/site-public.json`, generar SEO y volver a desplegar. Comprobar `/robots.txt`, `/sitemap.xml`, canonical y Open Graph.

Se autorizó únicamente la IP de salida **212.85.28.223** mediante una regla de firewall de la base `BD_VIAJES`. Si Hostinger cambia esa IP, revisar los registros privados y autorizar únicamente la nueva dirección necesaria. No desactivar TLS ni permitir indiscriminadamente todas las IP. Confirmar la conexión desde el alojamiento después de cualquier cambio.

## Alcance del pago

El pago sigue siendo ficticio por decisión del propietario. Conserva el diseño y presenta el mensaje «Pago realizado correctamente» después de guardar el recibo en el servidor. La aclaración «Operación de demostración; no se realiza ningún cobro» permanece visible en texto pequeño y legible, también en el historial y en el comprobante descargado. No se solicitan tarjetas ni se emiten reservas reales. Las políticas mantienen esa información.

## Comprobaciones de esta preparación

Pasaron la compilación, 157 pruebas automatizadas, la integración de cuentas y guardado con Azure, las pruebas de Google y Microsoft en el backend, recuperación con un emisor de prueba, compras, aislamiento, reintentos e historial en PHP y Node, reseñas y compatibilidad PHP.

En la dirección pública se verificaron 7 páginas con sesión y conexión SQL, 1.538 recursos con respuesta 200, el catálogo de 100 productos y 70 destinos, registro, rechazo de cuenta duplicada y contraseña incorrecta, cookies seguras, persistencia del carrito, compra ficticia, protección contra duplicación de pedidos, historial y cierre de sesión. Las rutas de configuración, módulos privados y plantillas responden 403 o 404. En el navegador se completó una compra temporal de dos productos y se verificaron su mensaje de éxito, historial y vaciado del carrito.

Para repetir las comprobaciones públicas de lectura: `node scripts/check-hostinger.mjs https://grey-eel-517422.hostingersite.com`. Los informes están en `.runtime/hostinger/live-checks.json` y `transactions-public.json`. No publicarlos junto con los archivos privados de las cuentas de comprobación.

La autenticación SMTP local se verificó sin enviar correo. El propietario confirmó que recibió el correo de recuperación solicitado en la web publicada. La entrada de Hostinger comprueba también la conexión SMTP sin enviar mensajes y registra solo éxito o código de error en sus registros privados: el despliegue final registró `SMTP connection verified`. El proveedor de IA respondió HTTP 503 tanto desde la aplicación publicada como en una solicitud directa; el planificador de respaldo sigue disponible. Se corrigió además la confusión de «Planificar mi viaje» con productos cuyo nombre contenía «viaje». La ruta utilizada coincide con la documentación oficial de Lightning: https://lightning.ai/models/ .

La cuenta temporal de publicación y sus dos pedidos se eliminaron de Azure al finalizar las comprobaciones, usando exclusivamente su identificador y correo de prueba. El informe sin credenciales está en `.runtime/hostinger/qa-cleanup.json`.

La última publicación figura como **Completed / Current**, 18 de octubre de 2026 a las 18:48, hora local. Se reconstruyó desde `hbuilds/last-source` después de incorporar la corrección de Rumbito. El archivo servido coincide por SHA-256 con el código local. El ZIP local actualizado `release-2026-10-18-startup-fixed.zip` incluye todas las correcciones; su inventario está en `.runtime/hostinger/manifest-final.json`. Las comprobaciones posteriores al último despliegue están en `final-deployment-check.json`.

Las capturas disponibles están en `evidencias/hostinger/`. El servidor de pruebas, sus cuentas temporales y los paquetes de `.runtime/` son material de trabajo y no deben incorporarse a los archivos públicos.


## Actualización móvil y Groq — 21 de octubre de 2026

Se conserva el dominio y la aplicación existentes. El paquete `release-2026-10-21T22-40-20-605Z.zip` incorpora Groq y `public/css/compartido/mobile.css`, que se aplica solo hasta 767,98 px.

- Accesos móviles visibles a Inicio, Destinos, Servicios y Tienda; cabecera ajustada a 320 px.
- Portadas compactas, equipo en una fila desplazable, reseñas horizontales y formulario de reseña plegable.
- Catálogos móviles con ocho resultados iniciales, carga progresiva y filtros plegables. Los filtros reinician el tramo visible; escritorio conserva todos los resultados.
- Tarjetas de destinos con imagen lateral, productos en dos columnas y carrito accesible al desplazarse.
- Google y Microsoft conservan sus controles originales, con cuadros blancos de igual tamaño.
- Las variables privadas de IA son `GROQ_API_KEY` y `GROQ_MODEL`; la llave no forma parte del ZIP.

Las pruebas de `mobile-refresh.test.mjs` recorren Inicio, Destinos, Tienda, Servicios y acceso/registro a 320, 390, 768 y 1440 px. Los informes y capturas están en `.runtime/mobile-review/`. Las comprobaciones de compras reales y publicación deben distinguirse de las pruebas visuales anónimas, que se detienen ante el requisito de iniciar sesión.

Publicación confirmada: Hostinger muestra **Completed / Current**, 21 de octubre de 2026 a las 16:45:48 (America/Guatemala). `npm run chat:check -- https://grey-eel-517422.hostingersite.com` confirmó una respuesta real de Groq. Las hojas y scripts publicados se compararon con la copia local, y las siete páginas principales incluyen los estilos móviles nuevos. Ver `.runtime/mobile-review/verification.json` y `public-files.json`.

La comprobación pública posterior también pasó las seis páginas a 320, 390, 768 y 1440 px (`public-browser.log`). Se detectó caché antigua en un navegador que había visitado el sitio: se vació la CDN de Hostinger y se versionaron los enlaces a `navigation.js` y `mobile.css` con `?v=mobile-20261021` para que visitantes anteriores reciban los archivos nuevos.

Despliegue final con archivos versionados: `release-2026-10-21T22-51-33-817Z.zip`, **Completed / Current**, 21 de octubre de 2026 a las 16:55:38 (America/Guatemala). El navegador que conservaba recursos antiguos confirmó la navegación nueva al recargar. Evidencia: `public-team-final.png` y `public-final-html.json`.
