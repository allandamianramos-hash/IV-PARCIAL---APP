# Catálogo ampliado

18 destinos; el inicio presenta como máximo seis. El filtro busca en todo el catálogo y el enlace conserva los criterios de búsqueda.

Londres, Lisboa, Toronto y Río de Janeiro tienen cinco alojamientos ficticios cada uno, con fotos de referencia y tarifas de demostración. Las fuentes y licencias se conservan en CREDITOS-HOTELES.json y CREDITOS-DESTINOS-NUEVOS.json.

Fuentes de aeropuertos:
- https://www.heathrow.com/contact-us
- https://www.lisbonairport.pt/en/lis/home
- https://www.torontopearson.com/en/
- https://www.riogaleao.com/passageiros/voos/painel-de-voos/

Los datos SQL existentes tienen prioridad. Las cuatro propuestas nuevas se incorporan al catálogo cliente si aún no existen en SQL; no se modificó la base compartida. El comando existente npm run db:seed permite incorporarlas al actualizar la base.
