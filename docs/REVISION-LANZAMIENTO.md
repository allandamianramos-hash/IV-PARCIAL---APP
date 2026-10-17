# Revisión de lanzamiento de Rumbo

Fecha: 17 de octubre de 2026. Entorno revisado: proyecto local en Windows, servidor PHP y alternativa Node, conectados a Azure SQL.

**Resultado:** el sitio permite probar una compra completa y consultar su historial por cuenta. La presentación legal es más sobria y el consentimiento funciona. Esta versión continúa siendo una demostración: no cobra dinero, no reserva servicios y no entrega productos. No se ha publicado el sitio.

El país de operación, dominio, nombre legal y correo de privacidad siguen sin definirse, según lo indicado por el propietario. No se inventaron esos datos ni se atribuyó una legislación al negocio.

## Pagos, cuenta e historial

- Tienda y servicios comparten un solo diálogo de pago: detalle, total en HNL, aceptación de los términos de la simulación, resultado aprobado/rechazado y comprobante descargable. No hay campos de tarjeta ni datos bancarios.
- Una prueba rechazada conserva la selección y no crea una compra. Una aprobada guarda un comprobante en SQL. Reintentar la misma confirmación, incluso concurrentemente, devuelve la compra existente.
- **Mi cuenta → Viajes y compras** abre el historial, con filtros de tienda y viajes/servicios, detalle y paginación de 20 registros. **Mi viaje actual** conserva el resumen editable del viaje.
- El servidor identifica al propietario desde su sesión. El navegador no puede elegir de qué cuenta consultar las compras. El historial persiste al cambiar de navegador, editar el viaje o vaciar el carrito.
- Los comprobantes conservan los conceptos y precios de la confirmación. El historial incluye las nuevas simulaciones; los comprobantes antiguos que solo estaban guardados localmente no se convierten automáticamente en compras verificadas.
- La tienda y el planificador siguen teniendo selecciones independientes. La confirmación de servicios comprueba que el plan esté completo y sea coherente. Los precios de viajes siguen siendo de demostración; no son cotizaciones de proveedores.

Prueba manual: crea una cuenta o inicia sesión, agrega un producto, abre el carrito y continúa al pago. Prueba primero «Rechazado» y luego «Aprobado». Repite desde Mi viaje después de completar sus selecciones. Abre Viajes y compras y comprueba ambos registros.

## Revisión del documento adjunto

Se implementaron los ocho puntos del archivo, agrupando sus dos menciones a privacidad:

- **Política de privacidad:** información tratada, finalidades, Azure y proveedores, cuentas, Rumbito, reseñas públicas, conservación, control del usuario y limitaciones actuales. Versiones completas en español e inglés.
- **Cookies:** inventario de cookies y almacenamiento local, duración y preferencias. «Solo necesarias», «Aceptar analítica» y «Configurar» están disponibles; el pie permite retirar el permiso. La analítica no se envía antes de consentir. Se respetan Do Not Track y Global Privacy Control.
- **Términos:** condiciones de uso, moneda, simulaciones, comprobantes, ausencia de reservas, envíos y cargos reales, servicios externos y contacto.
- **Cambios y cancelaciones:** apartado adicional, coherente con el modo de demostración. No promete reembolsos de pagos que no existen.
- **Open Graph:** título, descripción e imagen por página pública; las fichas de destino usan su fotografía. Incluye datos para tarjetas sociales. Las direcciones absolutas se completarán con el dominio HTTPS.
- **Analítica web:** contadores por categoría de página y día, sin identificar personas, cuentas, conversaciones o compras. No mide usuarios únicos. La tabla es `RumboPageViews`; se depura al recibir eventos para mantener una ventana de aproximadamente 90 días. No hay un proveedor publicitario ni un panel público con datos de usuarios.
- **Meta título y descripción:** metadatos renderizados desde el servidor para 85 rutas públicas. El historial y las páginas de cuenta quedan fuera de la indexación.
- **Sistema XML:** `/sitemap.xml` y `/robots.txt` preparados. Hasta definir dominio y activar indexación, robots impide el rastreo y el sitemap responde 503 con una explicación. Es intencional; no se publica un mapa con direcciones localhost.

Las páginas legales usan tipografía legible, índice, fecha y enlaces relacionados, sin imágenes decorativas. Mantienen el estilo oscuro y minimalista del sitio. Los documentos legales se muestran en español o inglés y avisan de esa disponibilidad al seleccionar otro idioma; no se presentan traducciones legales automáticas como revisadas.

La opción de aceptar/rechazar sigue las buenas prácticas descritas en la [guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf). Esa referencia no significa que se haya determinado la jurisdicción aplicable a Rumbo. El sitemap utiliza direcciones canónicas conforme a la [documentación de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Contenido, fotografías e idiomas

Se recorrieron los 70 destinos en escritorio y móvil, sus servicios y fotografías; también Inicio, tienda, servicios, perfil, ayuda, páginas legales y acceso. Las pruebas comprueban que los recursos locales cargan, que las imágenes tienen dimensiones y que los controles principales caben en pantalla. La tienda se comprobó en anchos de 320, 390, 768, 1024 y 1440 píxeles; las políticas en 320, 390 y 1440.

Se detectaron textos recientes de productos que no estaban en los diccionarios y se traducían parcialmente, mezclando idiomas. Se incorporaron nombres, descripciones y variantes del catálogo vigente, además del pago, historial y privacidad. Hay 4.559 mensajes en cada uno de los diez diccionarios. Los mensajes principales del flujo y las traducciones inglesas nuevas se revisaron; parte del resto usa traducción automática local. La comprobación automatizada de los diez idiomas no sustituye una revisión de un hablante competente en cada idioma.

**Limitación de contenido:** varias fotografías de hoteles son referencias y pueden pertenecer a un establecimiento de otro país. Ahora las tarjetas lo indican expresamente. Por ejemplo, una fotografía asociada al hospedaje de demostración de Roatán corresponde a otro hotel. No se debe presentar ese catálogo como inventario comercial verificado. Para vender reservas habrá que sustituirlo por establecimientos, ubicación, disponibilidad y fotografías confirmados por el proveedor. Los vuelos, pólizas y experiencias también son propuestas de demostración; las pruebas de estructura y coherencia de destinos no verifican la operación real de cada servicio.

Las imágenes de productos son ilustraciones del catálogo de demostración. Antes de vender artículos físicos deben corresponder al artículo, variantes, medidas y existencias reales. Se conservan las páginas de atribución existentes. No se realizó una nueva comprobación jurídica de cada licencia externa ni una inspección manual exhaustiva de todas las fotografías.

## Base de datos y capacidad

Se aplicaron las migraciones `008_demo_orders.sql` y `009_aggregate_analytics.sql` a Azure SQL y se actualizaron los instaladores. Se añadieron los destinos y hospedajes ausentes sin sobrescribir los registros anteriores. La base contiene 100 productos, 70 destinos y 350 hospedajes; están registradas nueve migraciones.

La consulta de capacidad encontró Azure SQL **Basic**, límite configurado de **2 GiB**, y aproximadamente **29,5 MiB de datos utilizados** en un archivo de 32 MiB. El almacenamiento tiene margen, pero eso no determina cuántas personas pueden usar el sitio simultáneamente. Basic también tiene límites de cómputo y concurrencia; la referencia oficial es [Microsoft: límites DTU para bases individuales](https://learn.microsoft.com/en-us/azure/azure-sql/database/resource-limits-dtu-single-databases?view=azuresql).

Los recibos tienen un índice por cuenta y fecha de inserción, unicidad para evitar duplicados y paginación. Las cuentas, selecciones y compras no tienen todavía una política automática de eliminación por antigüedad. Antes de operar públicamente hay que definir retención, eliminación de cuentas y limpieza de visitantes inactivos, sin borrar datos arbitrariamente.

La medición de carga reproducible está en `scripts/load-test.mjs`; los resultados finales se adjuntan en `evidencias/lanzamiento/capacidad-local.json`. Prueba únicamente localhost con 1, 5, 10 y 25 solicitudes simultáneas, una cookie de visitante preparada por servidor, recursos estáticos y peticiones GET a inicio, destinos, tienda, catálogo y estado. Usa Azure SQL real. No simula sesiones completas de personas, compras concurrentes, una conexión móvil, una CDN ni el alojamiento definitivo. El escenario de 25 solicitudes contiene solo 50 peticiones: es una prueba breve, no una prueba prolongada de estabilidad.

**Resultados finales: 360 solicitudes medidas y cero errores.** En las peticiones dinámicas, el tiempo p95 —el umbral dentro del que respondió el 95 %— fue:

- PHP local: 0,71 s con concurrencia 1; 2,20 s con 5; 4,01 s con 10; **10,86 s con 25**. En este último nivel procesó 2,39 solicitudes por segundo.
- Node local: 1,26 s con concurrencia 1; 1,62 s con 5; 1,74 s con 10; **4,71 s con 25**. En este último nivel procesó 7,03 solicitudes por segundo.

No se observó una caída en esta muestra, pero las esperas altas son un motivo para ajustar la infraestructura antes del lanzamiento. No se puede convertir «25 solicitudes concurrentes» en «25 personas» ni extrapolarlo a cientos o miles de usuarios. La muestra pequeña tampoco demuestra que Node sea siempre más rápido. [Resultados completos](../evidencias/lanzamiento/capacidad-local.json) y [consulta de capacidad de SQL](../evidencias/lanzamiento/base-de-datos.json).

El servidor integrado de PHP ejecuta un único proceso y puede acumular solicitudes; en Windows no admite múltiples trabajadores. PHP indica que este servidor no debe usarse para publicar en una red pública. Debe sustituirse por un alojamiento de producción con PHP/FastCGI o una configuración de producción de Node. [Manual oficial de PHP](https://www.php.net/manual/en/features.commandline.webserver.php).

## Validación realizada

- Compilación TypeScript, Vite, acceso Microsoft y generación SEO: correcta.
- 153 pruebas unitarias: correctas.
- Integración con SQL real en PHP y Node: compra de tienda y viaje, persistencia, aislamiento entre cuentas, rechazo de datos adicionales y origen externo, reintentos concurrentes, selección desactualizada e historial inmutable: correcta.
- 11 escenarios de navegador: catálogo completo a dos anchos, pagos e historial, consentimiento y políticas, portada y movimiento reducido, diez idiomas, contenido dinámico, árabe móvil, reseñas y tienda. Los dos fallos iniciales de idioma/interacción con el aviso se corrigieron y sus escenarios se repitieron satisfactoriamente.
- Comprobación de sintaxis PHP de los archivos añadidos y router: correcta.
- Pruebas de metadatos, canonical, exclusión de páginas privadas y sitemap: incluidas en las unitarias.

Las pruebas de compras crean cuentas temporales y eliminan sus propios registros. Las capturas de historial muestran esas cuentas ficticias; no representan ventas reales. Las protecciones añadidas incluyen impedir la incrustación desde otros sitios y restringir objetos incrustados y cambios de URL base. No se realizó una auditoría de seguridad independiente ni una certificación de cumplimiento.

## Antes de publicar

1. **Definir operador y contacto:** nombre legal, país, domicilio o datos que correspondan, canal de privacidad y atención. Revisar con una persona competente las obligaciones del país y de los mercados atendidos. Completar los textos con bases de tratamiento, derechos, plazos, conservación, proveedores y transferencias que realmente correspondan. Los campos de configuración no sustituyen esa revisión del contenido.
2. **Elegir dominio y alojamiento:** HTTPS, variables de origen, secretos fuera de `public/`, identidad de base con permisos de aplicación y copias de seguridad con una restauración comprobada. Preparar un entorno de pruebas separado de los usuarios reales. No publicar la carpeta entera como archivos estáticos ni abrir el servidor de desarrollo a Internet.
3. **Verificar el dominio real:** acceso Google/Microsoft y sus redirecciones, recuperación por correo, envío y entregabilidad, cookies Secure, rutas y páginas de error. Estas integraciones no se pueden dar por verificadas para un dominio que aún no existe.
4. **Activar buscadores y redes:** establecer `origin` HTTPS y `indexable: true` en `config/site-public.json`, ejecutar `npm run build:seo` y reiniciar Node si se usa. Comprobar sitemap, canonical y vista previa social en el dominio. Registrar el sitio en Search Console. Mantener el entorno de pruebas sin indexar.
5. **Si se publicará solo como demo:** mantener los avisos y el simulador, evitar datos sensibles innecesarios y atender las cuentas reales. Si habrá ventas, primero integrar un proveedor de pagos, verificación de cobros en servidor, conciliación, reglas fiscales y comerciales, cancelaciones, inventario y proveedores reales. El simulador no se puede convertir en cobro real cambiando una etiqueta.
6. **Medir en el alojamiento definitivo:** probar usuarios autenticados, escrituras y picos de tráfico con una base de pruebas, observar tiempos p95, errores, CPU/DTU y conexiones. Acordar un objetivo de respuesta y tráfico antes de contratar capacidad. Probar respaldo/restauración y el comportamiento cuando Azure no responde.
7. **Revisar contenido comercial y traducciones:** comprobar establecimientos, aeropuertos/rutas, fotografías y licencias con sus fuentes, y revisar humanamente los idiomas en los que se atenderá a clientes. Mantener fechas, tarifas y conversiones como orientativas hasta conectarlas con proveedores reales.

## Después de publicar

Medir visitas consentidas y errores, revisar búsquedas sin resultados y abandono del pago, vigilar tiempos de carga y consumo de Azure, actualizar destinos y condiciones, corregir enlaces externos y revisar dependencias. Configurar alertas y pruebas periódicas de restauración en la infraestructura elegida. El servidor ya ofrece compresión gzip y revalidación con ETag para recursos públicos; comprobar esas funciones tras desplegar y mejorar tamaños, formatos y distribución de imágenes según las mediciones reales, conservando el aislamiento de páginas y API con datos de cuenta. Ampliar traducciones legales a otros idiomas solo con una revisión adecuada.

Mi valoración: la navegación y la estética tienen una base consistente y el flujo de demostración ya se puede probar de principio a fin. Los pendientes de mayor importancia para un lanzamiento público son la identidad del operador, alojamiento, recuperación de cuentas en el dominio real, gestión de datos y definición de si será demostración o servicio comercial. Para vender, falta además la conexión real con proveedores y pagos.

## Mantenimiento y archivos

- Configuración pública: `config/site-public.json`. Actualmente no tiene dominio ni datos legales y mantiene `indexable: false`; la analítica opcional está disponible únicamente con consentimiento.
- Políticas: `public/js/compartido/policies.js`; consentimiento: `privacy.js`; pago e historial: `checkout.js`, dentro de la misma carpeta.
- Consultar analítica: ejecutar `database/CONSULTAR_ANALITICA.sql` con la cuenta de aplicación o una cuenta administrativa autorizada; devuelve agregados, no personas.
- Repetir comprobaciones: `npm test`, `npm run build`, `npm run test:checkout`, `node --test --test-concurrency=1 tests/browser/launch.test.mjs tests/browser/site.test.mjs tests/browser/destinations-complete.test.mjs tests/browser/store-independence.test.mjs`, `npm run test:load`.
- La prueba de carga no debe ejecutarse a la vez que otras pruebas si se quieren comparar sus tiempos. Su límite de localhost es deliberado.
- PHP necesita Node disponible para el motor compartido de cotización; `NODE_BIN` puede indicar su ruta. En otras instalaciones se aplican las nuevas migraciones con una cuenta autorizada para cambiar el esquema. La cuenta normal no necesita permiso para crear tablas.
- Los procesos Node que ya estuvieran abiertos requieren reinicio para cargar los endpoints nuevos. El servidor PHP local recarga los archivos por petición.

Capturas: [historial](../evidencias/lanzamiento/historial-escritorio.png), [pago móvil](../evidencias/lanzamiento/pago-movil.png) y [política de privacidad](../evidencias/lanzamiento/privacidad-1440.png).
