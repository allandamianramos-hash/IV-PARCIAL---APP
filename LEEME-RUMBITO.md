# Rumbito

El asistente virtual funciona en el navegador sin cuentas, claves ni servicios de IA externos. Es un asistente programado para el contenido de Rumbo, no un modelo generativo instalado.

## Abrir

Abre index.html directamente, o ejecuta INICIAR-RUMBO.cmd y visita http://localhost:3000. Node 22 o posterior solo se necesita para el servidor opcional y las pruebas. No hay paquetes que instalar.

## Conversaciones

- "Viajo con familia, somos dos, queremos playa y tenemos 20 mil".
- "Hoteles en Bali", "Y en Roatan", "Itinerario de Bali".
- "Vuelos a Kioto", "Que llevar", "Precio de power bank".
- "Crear mi pase", "Cambiar presupuesto", "Somos tres".

Recoge acompanantes, viajeros, estilo y presupuesto; entiende importes como 20 mil, 20,000 o 10000 por persona. Los importes por persona se multiplican por los viajeros. Los vuelos, hoteles y el pase tienen precios de muestra independientes. No hace reservas ni consulta informacion actual en Internet.

La conversacion vive en memoria: reiniciar o recargar la borra. El chat no envia mensajes a servicios externos. Las fotografias y fuentes ya existentes del sitio pueden necesitar Internet.

## Archivos

- chat-engine.js: intenciones, contexto, calculos, recomendaciones y respuestas.
- script.js: conversacion, acciones, personaje animado y conexion con el pase.
- style.css e index.html: presentacion de Rumbito.
- tienda.js: fuente unica de productos, compartida por la tienda y el asistente.
- viajes.js: fuente compartida de destinos, hoteles y vuelos del sitio.
- chat.test.mjs y server.test.mjs: pruebas; ejecutar npm test.
- server.mjs, package.json, INICIAR-RUMBO.cmd: servidor local opcional.

Se retiro la integracion de Puter y su documentacion. No se necesitan archivos .env. Para publicar usa los archivos HTML, CSS, JS y las imagenes; no publiques configuracion privada.

El personaje parpadea, flota y sigue el cursor. Las animaciones respetan la preferencia del sistema de reducir movimiento. Los accesos y sugerencias se pueden usar con teclado.
