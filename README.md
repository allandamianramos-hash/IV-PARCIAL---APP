# Rumbo

Sitio de viajes en HTML, CSS y JavaScript. Los catálogos y selecciones están conectados a SQL Server. Los precios y planes siguen siendo de demostración; no hay pagos ni reservas reales. Consulta BASE-DE-DATOS.md para la configuración y las migraciones.

## Abrir la copia correcta

Desde esta carpeta, ejecutar `npm start` o abrir `INICIAR-RUMBO.cmd`. Visitar `http://localhost:3000`. Ejecutar `npm install` al preparar otra copia; utiliza Node 22 o posterior. El chat requiere LIGHTNING_API_KEY en el archivo local .env; consulta LEEME-RUMBITO.md.

Para dejar Rumbito disponible entre sesiones de Windows, ejecutar una vez `ACTIVAR-RUMBO-AUTOMATICO.cmd`. Inicia el servidor en segundo plano al entrar a Windows y lo recupera si su proceso se detiene. `INICIAR-RUMBO.cmd` también funciona sin mantener abierta una terminal. El acceso automático depende de que esta carpeta permanezca en su ubicación; si la mueves, vuelve a activarlo.

Editar los archivos de esta misma carpeta y recargar el navegador. El servidor sirve los cambios directamente y desactiva la caché. Si se abre otra copia del proyecto o un sitio publicado, no se verán necesariamente los cambios locales. Un cambio de un compañero debe estar guardado en un commit y subido a la rama compartida para poder descargarlo.

## Dónde está cada parte

- **Inicio y Rumbito:** `index.html`, `style.css` y `script.js`. `chat-api.mjs` conecta GPT mediante Lightning AI y `chat-engine.js` conserva el planificador; `LEEME-RUMBITO.md` explica su funcionamiento.
- **Destinos, vuelos y hoteles:** `viajes.html`, `viajes.css` y `viajes.js`. Una sola página usa `pantalla=destinos`, `detalle-destino`, `vuelos` o `hoteles`. El catálogo de `viajes.js` también alimenta el inicio.
- **Tienda:** `tienda.html`, `tienda.css` y `tienda.js`. Incluye variantes, ajustes de precio, favoritos y carrito. `tienda.js` también proporciona los productos al asistente.
- **Otros servicios:** `servicios.html`, `servicios.css` y `servicios.js`. El parámetro `seccion` abre traslados, seguros, guías, Mi viaje, perfil y ayuda.
- **Navegación común:** `common.js` y `common.css`. Se utilizan en las cuatro páginas.
- **Fotografías:** `imagenes/` para productos e `imagenes-viajes/` para destinos y alojamientos. `evidencias/` contiene capturas, no páginas del sitio.
- **Servidor y validación:** `server.mjs`, `package.json` y los archivos `*.test.mjs`. Si se añade un recurso público, actualizar la lista permitida de `server.mjs`.

Se mantienen las rutas actuales para no romper enlaces. No hace falta crear un HTML distinto para cada vista de viajes o servicios. En el inicio, `viajes.js` debe cargarse antes de `script.js`.

## Compartir cambios sin mezclar versiones

1. Revisar `git status` y guardar los cambios propios en un commit antes de integrar cambios del equipo.
2. Ejecutar `git fetch origin` y comparar la rama local con `origin/main`.
3. Si solo faltan commits remotos, ejecutar `git pull --ff-only`. Si Git informa que las ramas divergieron, integrar y resolver cada conflicto; no pegar dos versiones completas dentro de un archivo.
4. Ejecutar `npm test` y probar la página modificada en el navegador.
5. Revisar el diff, guardar la integración y subirla con `git push` cuando corresponda.

Quitar las líneas `<<<<<<<`, `=======` y `>>>>>>>` por sí solo no resuelve un conflicto: también hay que reconciliar las dos versiones del código. Cada HTML debe conservar un único documento y cada script cargarse una sola vez.

## Validación

`npm test` comprueba el servidor, el asistente y la integridad del proyecto: sintaxis de todos los scripts, conflictos de Git, documentos duplicados, identificadores repetidos, recursos locales ausentes y disponibilidad del catálogo compartido.

También conviene probar colores/tamaños y totales de la tienda, carrito desde el inicio, selección de vuelo/hotel y guardado de servicios. Las pruebas automáticas no sustituyen la revisión visual.

## Reparación de la integración

La fusión `52bd6ad` mezcló el trabajo de tienda de `13dfe7a` con las mejoras generales de `f22c22b`. El HTML contenía dos documentos y el JavaScript quedó cortado por un bloque de la versión anterior. La versión actual conserva las variantes y el diseño de la tienda nueva, junto con la navegación común y el acceso al carrito desde el inicio. Los créditos exactos de las fotografías se mantienen porque los archivos de imagen no cambiaron.

## Recorrido organizado

La sección «Arma tu viaje» del inicio es el punto de entrada. Las cabeceras llevan a las secciones del inicio. Cada servicio comparte siete pasos: vuelo, hospedaje, transporte, seguro, experiencias, tienda y resumen/pago. Transporte, seguro, experiencias y productos son opcionales; el vuelo también se puede omitir expresamente.

`journey.js` reúne las selecciones en «Mi viaje», calcula variantes del carrito y comprueba fechas y viajeros. El botón final completa exclusivamente un pago de demostración; no cobra, no solicita datos bancarios y no genera reservas. El ticket solo aparece tras esa confirmación y deja de ser vigente si se modifica el viaje. Para cobrar de verdad hacen falta servidor de pedidos, proveedores y pasarela de pago.

La sección final del inicio es una lista personal de preparativos, guardada localmente y sincronizada con SQL Server cuando hay conexión. Las guías conservan las explicaciones y Rumbito mantiene la orientación.

Pruebas: `npm test`. El recorrido completo, el pago de demostración, la invalidación del ticket, las variantes, el chat y la vista móvil fueron comprobados. En el catálogo actual ampliado a 100 productos faltan 64 archivos de fotografía; la comprobación de recursos informa ese problema. No se sustituyeron por imágenes de otros productos.
