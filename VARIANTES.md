# Vista interactiva de la maleta

Primera demostración, habilitada para el producto 2. Cuatro colores y tres escalas sobre la misma base; las variantes no cambian la geometría. El tamaño representa una comparación visual orientativa, no dimensiones exactas. El carrito conserva las opciones y utiliza la misma representación. Los demás productos conservan sus fotografías de referencia hasta disponer de una base individual.

Base: imagenes/maleta-variantes-base.png. Referencia: imagenes/maleta.jpg. Creada con la herramienta integrada de ImageGen, preservando transparencia; sin API/CLI externa. La extracción generativa es ilustrativa y puede introducir diferencias con la fotografía original, disponible en el detalle.

Prompt utilizado:

Use case: background-extraction and precise-object-edit. Edit target: attached suitcase photograph. Create ONE isolated full suitcase on a truly transparent background for an interactive ecommerce color preview. Preserve EXACT model silhouette, horizontal ridges, proportions, side zipper, wheels, telescopic handle, perspective, tiny badge and material details of the suitcase in the reference. Remove ALL garden/background/ground. Center entire suitcase including handle and wheels with 8% margin. Change ONLY the olive shell to neutral light gray (grayscale material, softly shaded, not shiny white), keep rubber wheels, zipper, handle and trim dark charcoal. Soft neutral studio lighting. No added objects, text, labels, watermarks or floor shadows. Realistic product photograph. Output transparent PNG.

Validación: node --test server.test.mjs chat.test.mjs project.test.mjs journey.test.mjs variantes.test.mjs (31 pruebas). Comprobado en navegador: rojo, 28 pulgadas, precio L 950, miniatura coincidente en carrito; artículo de prueba eliminado después.

## Fondo del jardín

La vista interactiva ahora compone la maleta sobre `imagenes/maleta-fondo-jardin.png`. El fondo permanece sin filtros de color y no cambia de escala. Se reconstruyó con la herramienta integrada de ImageGen a partir de la fotografía original, retirando la maleta; no es una copia exacta píxel por píxel del paisaje original. La misma composición se utiliza en la miniatura del carrito.

Prompt utilizado para el fondo:

Edit this original photograph to create a clean background plate for a product configurator. Remove ONLY the suitcase, including its handle and wheels, and its cast shadow in the right-hand foreground. Reconstruct the small area behind it naturally with the existing sandy stone pathway and garden foliage. Keep the entire remaining photograph as unchanged as possible: identical composition, camera, framing, crop, foliage, rocks, agave plants, fence, lighting, colors, depth of field, and 3:2 aspect ratio. Do not add any product, object, text or graphic. This must look like exactly the same original garden photograph before the suitcase was placed there. Preserve original visual positions to allow compositing the suitcase back at its original location.

Validación: 7 pruebas de variantes y recursos aprobadas; revisión visual de la variante azul de 28 pulgadas con el paisaje fijo. Captura: evidencias/maleta-fondo-jardin.png.
