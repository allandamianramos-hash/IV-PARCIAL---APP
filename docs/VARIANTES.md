# Variantes del catálogo

Revisión del 9 de octubre de 2026: 100 productos con nombres y fotografías distintos; 47 fotografías sustituidas por imágenes nuevas generadas con ImageGen integrado, sin CLI ni API externa. Los archivos están en `public/imagenes/productos/revisado-{id}.png`. Los prompts de cada recurso están en [catalogo-prompts.json](catalogo-prompts.json).

81 productos tienen opciones de color, tamaño o capacidad según corresponda. El navegador dibuja la misma foto en un canvas y anima el color y la escala durante 460 ms, conservando proporciones, textura y detalles. Una selección nueva interrumpe la transición anterior desde su estado actual. Con movimiento reducido el cambio es inmediato. La vista original sigue accesible y sirve de respaldo si la vista interactiva falla. Los cambios de capacidad electrónica (GB, mAh) conservan las dimensiones exteriores.

El tamaño es una comparación visual orientativa, no una medida física exacta. Las imágenes son ilustrativas; el recoloreado no sustituye fotografías de inventario real. No se cambia de modelo ni de fotografía al elegir otra variante. El carrito guarda y muestra las opciones seleccionadas.

La fuente del catálogo es `config/store-catalog.json`. Después de editarla, ejecutar `node scripts/sync-store-catalog.mjs` para actualizar el snapshot del navegador y el manifiesto de imágenes. Node y PHP aplican la misma revisión sobre el catálogo de la base de datos y mantienen los precios almacenados. Los carritos anteriores conservan sus artículos equivalentes cuando un identificador duplicado se reutiliza.

Verificación: pruebas de hashes de las 100 imágenes, sincronización de los catálogos, opciones válidas, persistencia del carrito, renderizado de las 81 vistas, transiciones interrumpidas y movimiento reducido. Capturas de escritorio y móvil en `.runtime/catalog-audit/` (archivos locales de QA).

## Catálogo con fondo blanco

Se aislaron las 53 fotografías que aún tenían fondos, incluida la mochila y la maleta. Los recortes están en `public/imagenes/productos/recorte-{id}.png`; los originales permanecen disponibles en el repositorio. Los 100 productos se presentan sobre blanco, con la misma foto transparente en la ficha y en las variantes. Ya no se compone la maleta sobre el jardín ni se recortan fotos de estudio en tiempo de ejecución. Los prompts y referencias de cada recorte están en [catalogo-recortes.json](catalogo-recortes.json), realizados con ImageGen integrado.

## Referencias históricas de la maleta

La primera versión del producto 2 utilizaba una base neutra y un jardín reconstruido. Estos recursos se conservan como antecedentes y no se utilizan en la presentación actual.

Base: imagenes/productos/maleta-variantes-base.png. Referencia: imagenes/productos/maleta.jpg. Creada con la herramienta integrada de ImageGen, preservando transparencia; sin API/CLI externa. La extracción generativa es ilustrativa y puede introducir diferencias con la fotografía original, disponible en el detalle.

Prompt utilizado:

Use case: background-extraction and precise-object-edit. Edit target: attached suitcase photograph. Create ONE isolated full suitcase on a truly transparent background for an interactive ecommerce color preview. Preserve EXACT model silhouette, horizontal ridges, proportions, side zipper, wheels, telescopic handle, perspective, tiny badge and material details of the suitcase in the reference. Remove ALL garden/background/ground. Center entire suitcase including handle and wheels with 8% margin. Change ONLY the olive shell to neutral light gray (grayscale material, softly shaded, not shiny white), keep rubber wheels, zipper, handle and trim dark charcoal. Soft neutral studio lighting. No added objects, text, labels, watermarks or floor shadows. Realistic product photograph. Output transparent PNG.

Validación: node --test server.test.mjs chat.test.mjs project.test.mjs journey.test.mjs variantes.test.mjs (31 pruebas). Comprobado en navegador: rojo, 28 pulgadas, precio L 950, miniatura coincidente en carrito; artículo de prueba eliminado después.

### Fondo del jardín (versión anterior)

La vista anterior componía la maleta sobre `imagenes/productos/maleta-fondo-jardin.png`, tanto en el detalle como en el carrito. El fondo se reconstruyó con la herramienta integrada de ImageGen a partir de la fotografía original, retirando la maleta. Se conserva como referencia histórica; la vista actual utiliza únicamente el recorte transparente sobre blanco.

Prompt utilizado para el fondo:

Edit this original photograph to create a clean background plate for a product configurator. Remove ONLY the suitcase, including its handle and wheels, and its cast shadow in the right-hand foreground. Reconstruct the small area behind it naturally with the existing sandy stone pathway and garden foliage. Keep the entire remaining photograph as unchanged as possible: identical composition, camera, framing, crop, foliage, rocks, agave plants, fence, lighting, colors, depth of field, and 3:2 aspect ratio. Do not add any product, object, text or graphic. This must look like exactly the same original garden photograph before the suitcase was placed there. Preserve original visual positions to allow compositing the suitcase back at its original location.

Validación: 7 pruebas de variantes y recursos aprobadas; revisión visual de la variante azul de 28 pulgadas con el paisaje fijo. Captura: evidencias/maleta-fondo-jardin.png.
