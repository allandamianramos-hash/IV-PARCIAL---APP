# Catálogo ampliado

70 destinos; el inicio presenta como máximo seis. El filtro busca en todo el catálogo y el enlace conserva los criterios de búsqueda.

Londres, Lisboa, Toronto y Río de Janeiro tienen cinco alojamientos ficticios cada uno, con fotos de referencia y tarifas de demostración. Las fuentes y licencias se conservan en CREDITOS-HOTELES.json y CREDITOS-DESTINOS-NUEVOS.json.

Fuentes de aeropuertos:
- https://www.heathrow.com/contact-us
- https://www.lisbonairport.pt/en/lis/home
- https://www.torontopearson.com/en/
- https://www.riogaleao.com/passageiros/voos/painel-de-voos/

Los datos SQL existentes tienen prioridad. Las propuestas nuevas se incorporan al catálogo cliente si aún no existen en SQL; no se modificó la base compartida. El comando existente npm run db:seed permite incorporarlas al actualizar la base.

## Ampliación a 40 destinos

Se agregaron 22 ciudades: Ciudad de México, Bogotá, Cartagena, Lima, Buenos Aires, Santiago, Medellín, Punta Cana, San Salvador, San Juan, Los Ángeles, Las Vegas, Vancouver, Ámsterdam, Berlín, Praga, Estambul, Dubái, Tokio, Seúl, Singapur y Sídney.

Cada nueva ficha incluye aeropuerto, fotografía, actividades concretas, seis alternativas de vuelo y tres hospedajes ficticios con fotos de referencia. Los 18 destinos anteriores conservan sus alojamientos. Total: 156 hospedajes. El inicio mantiene seis tarjetas y busca en todo el catálogo. No se modificó el carrusel.

## Ampliación de octubre de 2026: 30 ciudades más

El catálogo pasa de 40 a 70 destinos y de 156 a 246 hospedajes. Los 40 destinos anteriores conservan todos sus datos. Se incorporan Bangkok, Hong Kong, Macao, Antalya, Kuala Lumpur, Phuket, Pattaya, Taipéi, Milán, Viena, Atenas, Budapest, Florencia, Múnich, Dublín, Edimburgo, Pekín, Shanghái, Hanói, Ciudad Ho Chi Minh, Delhi, Mumbai, Agra, Jaipur, El Cairo, Marrakech, Ciudad del Cabo, La Meca, Medina y Shenzhen.

### Selección y fuentes

Consulta realizada el 14 de octubre de 2026. Se contrastaron ciudades ausentes del sitio con las publicaciones de Euromonitor sobre destinos urbanos y llegadas internacionales, y con las series históricas públicas. La selección reúne ciudades turísticas relevantes; no presenta las 30 como un ranking consecutivo ni mezcla el índice de atractivo urbano con la clasificación por visitantes. No se publican cifras de visitas estimadas como datos confirmados.

- [Euromonitor: Top 100 City Destinations Index 2025](https://www.euromonitor.com/article/top-100-city-destinations-index-2025-driving-growth-and-innovation).
- [Euromonitor: principales destinos urbanos de 2024](https://www.euromonitor.com/press/press-releases/december-2024/euromonitor-international-reveals-worlds-top-100-city-destinations-for-2024).
- [Tourism Authority of Thailand: Bangkok y llegadas internacionales de 2025](https://www.tatnews.org/2025/12/bangkok-tops-euromonitor-global-city-rankings-for-international-arrivals-in-2025/).
- [Series de ciudades por visitantes internacionales, con años y metodología](https://en.wikipedia.org/wiki/List_of_cities_by_international_visitors).

Las fuentes de turismo, aeropuertos y restricciones de cada ciudad están en `nuevos-destinos-contenido.json`, dentro de `sources`. La Meca y los espacios religiosos restringidos de Medina incluyen sus condiciones de acceso. Agra, Pattaya y La Meca indican el aeropuerto de llegada y el traslado terrestre por separado.

### Integración

Cada ciudad añade una foto real local de alta resolución y variantes de 720/1280 píxeles, aeropuerto identificado, descripción, recomendaciones, tres actividades destacadas, seis opciones de vuelo por origen, tres alojamientos y tres recorridos con paradas reales. Los recorridos nuevos usan la fotografía de su ciudad, identificada expresamente como referencia del destino. Los 140 recorridos anteriores mantienen sus fotos propias; el total pasa a 230.

Inicio, filtros, preferencias del perfil, fichas, vuelos, hoteles, traslados, seguros, guías, Rumbito y Mi viaje consumen el catálogo compartido. Las nuevas ciudades funcionan tanto con SQL conectado como con el catálogo local. Se conserva la precedencia de los registros existentes en SQL, así como el cálculo de grupos, clases, habitaciones, fechas, importes y descuentos. Los textos nuevos se incorporan a los diez catálogos de idioma.

Los destinos, aeropuertos y lugares de las rutas son reales. Vuelos, horarios, duraciones, tarifas, hoteles y servicios siguen siendo simulaciones del proyecto: no constituyen inventario disponible ni contratos con proveedores. Los hoteles son ficticios y sus fotografías son referencias. Créditos y licencias aparecen en la página de destinos y en los archivos `CREDITOS-DESTINOS-NUEVOS.json`, `CREDITOS-HOTELES.json` y `CREDITOS-GUIAS.json`.

### Actualización y comprobación

`node scripts/ampliar-destinos.mjs` regenera exclusivamente los bloques de esta ampliación a partir de los tres archivos de contenido y metadatos de fotos en `docs/`. Es idempotente y no reemplaza los bloques anteriores.

`node database/seed-destinations.mjs` agrega únicamente estas 30 ciudades y sus 90 alojamientos a la base configurada. Usa una transacción, no sobrescribe registros existentes y puede repetirse. No modifica cuentas, selecciones, productos ni configuraciones. Los demás equipos reciben los nuevos registros al compartir el código actualizado y conectarse a la misma base.

Comprobaciones: `npm test` y `node --test tests/browser/new-destinations.test.mjs`. Las pruebas comparan las huellas de los 40 destinos originales, verifican todos los nuevos datos y archivos, comprueban la convivencia con un catálogo SQL anterior simulado y recorren la reserva completa en escritorio y móvil, incluida la descarga del resumen. Las pruebas de navegador simulan la API y las revisiones de guardado; no modifican cuentas ni selecciones de la base compartida. Las capturas se guardan en `.runtime/nuevos-destinos-qa/`.

El 14 de octubre de 2026 se restableció el acceso de este equipo a Azure SQL autorizando únicamente su IP pública actual. La carga aditiva incorporó 30 destinos y 90 alojamientos: SQL contiene 48 destinos y 180 alojamientos; el catálogo combinado del sitio contiene 70 destinos y 246 alojamientos, incluidos los registros locales anteriores. Se comprobaron las huellas de todos los registros SQL previos para verificar que no cambiaron.
