# Catálogo ampliado

40 destinos; el inicio presenta como máximo seis. El filtro busca en todo el catálogo y el enlace conserva los criterios de búsqueda.

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
