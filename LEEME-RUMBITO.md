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

## Primera versión de servicios

- `servicios.html`: entrada de servicios, traslados, seguros, guías locales, perfil local, ayuda y Mi viaje. El parámetro `seccion` elige la vista.
- `servicios.js`: catálogo de ejemplo, filtros, validación, cálculos, guardado y descarga de selecciones. Conserva una elección por tipo de servicio. Los cambios de formulario requieren pulsar «Ver opciones» antes de seleccionar de nuevo.
- `servicios.css`: presentación adaptable a móvil con la paleta original.
- `common.js` y `common.css`: enlaces compartidos, acceso a Rumbito y navegación entre páginas.
- `viajes.js`: catálogo único de los seis destinos, sus fotografías y presupuestos de inspiración; se carga antes de `script.js` en el inicio. Las tarifas de vuelos y hoteles se calculan por separado del presupuesto orientativo.

Rumbito ahora es una brújula exploradora con mochila. También puede abrir las nuevas páginas al preguntar por traslados, seguros o guías locales. Copán utiliza la fotografía local del sitio arqueológico, con créditos disponibles desde el catálogo de destinos.

### Almacenamiento y próxima integración

No hay base de datos, autenticación, proveedores ni pagos conectados. El perfil es un alias local, no una cuenta. Los seguros son ejemplos visuales y no activan ninguna cobertura.

Las claves `rumbo.services.v1` y `rumbo.profile.v1` guardan servicios y perfil. El módulo de viajes usa `rumbo.integrante2.viaje.v1`; la tienda conserva sus claves `rumbo.store.cart.v2` y `rumbo.store.favorites.v2`. Si el navegador bloquea el almacenamiento, los servicios ofrecen descargar la selección. Para compartir almacenamiento entre páginas, se recomienda abrir el servidor local en vez de `file://`.

Para integrar la base de datos después, sustituir los catálogos de muestra y las funciones de lectura/escritura local por consultas a una API, manteniendo la validación de capacidad, fechas y cantidades. La API deberá volver a calcular y validar precios y disponibilidad antes de crear reservas.
