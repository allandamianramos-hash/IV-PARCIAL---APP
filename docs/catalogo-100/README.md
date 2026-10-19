# Ampliación de 70 a 100 destinos

Se incorporan 30 destinos con aeropuerto comercial, 300 experiencias y 150 hospedajes de demostración. Los 70 destinos anteriores se conservan. La página de inicio mantiene seis destacados.

Cada destino dispone de diez experiencias, cinco hospedajes, tres tipos de habitación y seis alternativas de vuelo por origen (Tegucigalpa y San Pedro Sula). Los tres tipos de traslado y cuatro planes de seguro son compartidos por el catálogo; se aplican los filtros de pasajeros, equipaje y duración existentes.

## Datos y fotografías

- `ciudades.json`: contenido y precios de demostración de los nuevos destinos.
- `aeropuertos.json`: códigos y servicio regular contrastados con OurAirports.
- `experiencias.json` y `hospedajes.json`: propuestas de demostración, no inventario contratado.
- `fotos.json`: procedencia y licencia individual de cada fotografía. Las fotos de experiencias ilustran el destino; las habitaciones son referencias visuales, no fotografías de establecimientos reservables.
- Las licencias también se conservan en `public/imagenes-viajes/CREDITOS-CATALOGO-100.json` y en el apartado de créditos existente.

## Integración y comprobación

Ejecutar desde la raíz del proyecto con Node 22:

```powershell
node scripts/integrar-catalogo-100.mjs
node scripts/build-seo.mjs
node --test tests/catalogo-100.test.mjs tests/destinos-completos.test.mjs tests/destinos-ampliados.test.mjs tests/viajes-catalogo.test.mjs
$env:BROWSER_TEST_ORIGIN='http://127.0.0.1:3010'
node --test tests/browser/catalogo-100.test.mjs
```

La integración es repetible. La prueba de regresión compara hashes de los 70 destinos y 700 experiencias originales. Las pruebas del navegador usan un estado simulado para no modificar viajes de usuarios reales.

Para agregar únicamente los registros nuevos a una base ya configurada:

```powershell
node database/seed-destinations.mjs --catalogo-100
```

El script utiliza una transacción y bloqueo de semilla. Inserta únicamente identificadores ausentes; no reemplaza precios ni datos existentes. Las experiencias y alternativas de vuelo usan el catálogo y generadores del cliente, como los destinos anteriores.
