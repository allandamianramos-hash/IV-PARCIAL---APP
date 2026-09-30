# Publicidad de Rumbo

Las cuatro campañas sustituyen la imagen de portada. El carrusel cambia cada 5 segundos; tiene flechas, indicadores, pausa, teclado y gesto horizontal. Se detiene mientras el cursor o el foco están dentro, mientras la pestaña no es visible y, por defecto, cuando el usuario prefiere movimiento reducido. Las imágenes siguientes se precargan. Los textos y botones son HTML accesible, no texto incrustado en una imagen.

## Campañas y precios

- Escapadas: 25 % en vuelos a Cancún y Madrid. Cancún desde L 7,200 a L 5,400; Madrid desde L 19,500 a L 14,625.
- Europa: 20 % en vuelos a Venecia para visitar las Dolomitas. Desde L 22,500 a L 18,000. El traslado a las Dolomitas es independiente.
- Fin de año: enlace al planificador de vuelos y servicios; el usuario elige las fechas.
- Elige tu destino: enlaces a los filtros de playa, naturaleza y cultura.

Los importes anteriores son de ida desde Tegucigalpa, en económica y por persona. El porcentaje también se aplica a ejecutiva y al otro origen del catálogo, calculando primero la tarifa completa y redondeando a centavos. Hoteles y servicios no se descuentan. El total del viaje y su resumen descargable usan estos mismos precios. Los presupuestos orientativos de los destinos promocionados suman el vuelo rebajado y la estancia base.

La campaña se adaptó al catálogo existente: no anuncia París ni Roma, que no tienen itinerarios aquí. No se conserva la restricción de octubre ni el mensaje «próximamente» de las referencias; estas ofertas del catálogo están activas sin límite de fechas. Los descuentos se configuran en `promotions` en `viajes.js`; si cambian, actualizar también los porcentajes y condiciones del anuncio en `index.html`.

El sitio sigue siendo un planificador de demostración. La reducción sí se aplica a sus cálculos; no constituye una oferta ni una reserva de una aerolínea externa. No se añadieron cobros ni se alteraron las funciones de selección y eliminación de servicios.

## Rediseño publicitario

La portada usa Montserrat (500, 600 y 800) en una composición de álbum de viaje: fondo crema con textura de papel, fotografías con marcos blancos y rotaciones distintas, etiqueta de equipaje para el descuento y una ruta de vuelo animada. Cada anuncio varía la posición de las fotos dentro del mismo sistema teal, crema y arena. El precio y la acción se integran en el texto. La navbar conserva su diseño y tipografía.

En móvil, el collage y el descuento aparecen entre el titular y el precio. Las fotos usan `object-fit: cover` y se reemplazan cambiando los `src` de `.campaign-photo` en `index.html`. Las animaciones de entrada y el avión respetan movimiento reducido; el carrusel conserva pausa, flechas y cambios cada cinco segundos.

Fotografías activas: `destino-cancun.jpg`, `hotel-bali-terraza.jpg` (piscina en Cancún), `dolomitas.jpg`, `hotel-valle.jpg`, `bali.jpg`, `kioto.jpg`, `playa.jpg` y `destino-madrid.jpg`, de `imagenes-viajes`. Sus referencias y licencias permanecen en el catálogo. Los archivos `promo-*.jpg/png` se conservan como versiones anteriores, pero ya no se muestran en la portada.

## Imágenes de la primera versión (archivadas)

Adaptaciones creadas con la herramienta integrada **imagegen**, usando las cuatro publicidades entregadas como referencias. Los originales del usuario no se modificaron. Paleta: petróleo #065f68, menta #d8eee5, arena #e8bd78 y papel crema. Se conservaron los motivos de fotografías, avión y viajeras.

- `imagenes/promo-ofertas.png` y versión web `imagenes/promo-ofertas.jpg`.
- `imagenes/promo-europa.png` y versión web `imagenes/promo-europa.jpg`.
- `imagenes/promo-temporada.png` y versión web `imagenes/promo-temporada.jpg`.
- `imagenes/promo-destinos.png` y versión web `imagenes/promo-destinos.jpg`.

Las versiones web se codificaron como JPEG calidad 88, sin cambiar dimensiones ni composición: aproximadamente 1.39 MB en total frente a 9.64 MB de los PNG maestros.

## Prompts utilizados

1. Adapt this travel advertisement into a polished photoreal editorial collage for Rumbo website. Portrait 4:5. NO TEXT, no lettering, no numbers, no logos. Keep the idea of cream paper polaroid travel photos and curved travel lines, but ONLY TWO photos: Cancun turquoise coast and Madrid Puerta de Alcala. Replace saturated blue with deep petrol teal #065f68, muted mint #d8eee5 and warm sand #e8bd78. Beautiful tactile cream paper, sunlight, sophisticated travel magazine art. Photos fill composition with some space at top; no Paris or Rome. No discounts printed; website adds accurate accessible HTML text.
2. Adapt this Rumbo Europe travel poster into a premium photoreal editorial website art, portrait 4:5, NO TEXT, no letters numbers or logos. Keep the white passenger airplane and dreamy cutout travel collage concept, but replace Eiffel and Pisa with beautiful Italian Dolomites mountains, alpine lake and charming alpine village, which is the actual available Italy destination. Deep petrol #065f68, sage mint #d8eee5, warm cream and restrained sand gold #e8bd78. Sophisticated paper collage with soft natural daylight. Focus fills center/lower area, calm upper margin. No printed discounts; website adds them.
3. Adapt this reference travel poster for Rumbo web campaign. Portrait 4:5 premium photoreal editorial collage, no text, letters, numbers or logos. Preserve recognizable female traveler with straw hat sunglasses passport and suitcase, plus white passenger airplane motif. Recompose compact portrait so woman and luggage fit without awkward crops; background deep petrol teal #065f68, soft mint #d8eee5 and warm cream, restrained sand #e8bd78 accents. Warm inviting sunlight, stylish travel magazine cutout design, high quality realistic anatomy. No promises or labels: HTML supplies campaign text.
4. Adapt reference advertisement as premium Rumbo website travel collage, portrait 4:5. NO TEXT, letters, numbers or logos. Preserve woman with straw hat sunglasses backpack and dark green suitcase, recompose on right with three beautiful rounded photo windows on left: Caribbean beach, mountain landscape, historic city. Soft mint #d8eee5, deep petrol teal #065f68, cream and warm sand #e8bd78. Natural editorial photographic quality, elegant clean composition, soft shadows. Remove all old captions and soon/exclusive wording; HTML will provide live catalogue navigation.

## Validación

`npm test` incluye comprobaciones de porcentajes, vuelos de ambos orígenes, ambas clases, ausencia de descuentos acumulados, varios pasajeros y conservación del precio del hotel. Las pruebas de integridad comprueban recursos, sintaxis y navegación existente.
