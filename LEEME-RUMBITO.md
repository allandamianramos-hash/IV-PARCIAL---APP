# Rumbito

Rumbito conversa con GPT-5 mini a través de Lightning AI. El servidor mantiene la llave privada y usa los catálogos del sitio y el planificador existente para orientar las respuestas.

## Abrir

Requiere Node 22 o posterior. Copia .env.example a .env si aún no tienes configuración y coloca tu llave de Lightning en LIGHTNING_API_KEY. Ejecuta npm start o INICIAR-RUMBO.cmd y visita http://localhost:3000. No hay dependencias que instalar. Reinicia el servidor después de cambiar .env.

La IA requiere este servidor. Al abrir index.html directamente, usar una vista estática o perder conexión, Rumbito responde con el catálogo local y muestra «Modo local». Vuelve a intentar la IA en cada mensaje enviado por HTTP; el respaldo no oculta rechazos ni límites de uso. La configuración local ya está preparada en esta copia. Nunca publiques .env: está excluido de Git y el servidor no lo sirve.

## Conversación y privacidad

Los mensajes, hasta doce mensajes recientes y el contexto del catálogo se envían a Lightning AI para generar respuestas con el modelo de OpenAI. La aplicación no guarda conversaciones en disco; recargar o empezar de nuevo borra el historial local, pero no borra registros que pueda mantener el proveedor. No introduzcas contraseñas, tarjetas ni documentos en el chat.

Se conservan las sugerencias, enlaces y cálculos del planificador. Los importes son de demostración en HNL; el modelo no hace reservas ni consulta disponibilidad en vivo. Si el proveedor falla, el planificador local mantiene la conversación; su modo se indica encima de los mensajes.

Prueba: “Viajo con familia, somos dos, queremos playa y tenemos 20 mil”, “Hoteles en Bali”, “Qué llevar” o “Vuelos a Kioto”.

## Configuración y despliegue

- LIGHTNING_API_KEY: secreto del servidor, nunca del navegador.
- RUMBITO_MODEL: openai/gpt-5-mini, modelo validado con esta integración.
- APP_ORIGIN: origen HTTPS exacto del sitio en producción. Sin configurarlo, se aceptan orígenes locales.
- Límite por proceso: doce solicitudes/minuto por IP, tres simultáneas y doscientas por día UTC. Los contadores se reinician con el proceso; para múltiples instancias o uso público persistente se necesita un contador compartido y controles de acceso.
- Cada consulta consume créditos de Lightning. El servidor limita la respuesta a 2400 tokens y espera un máximo de treinta segundos.

Para publicar, ejecuta Node detrás de un proxy HTTPS, configura los secretos en el alojamiento y dirige /api/chat al mismo servidor. Un alojamiento puramente estático necesita un backend adicional. No cambies la URL del proveedor para enviar la llave a otro servicio.

## Archivos

- chat-api.mjs: conexión privada, catálogo, validación, límites y errores.
- server.mjs: archivos públicos y POST /api/chat.
- chat-engine.js: intenciones, cálculos, opciones y enlaces existentes.
- script.js: historial, estados del chat y peticiones al servidor.
- imagenes/rumbito-pin.png: mascota de ubicación de fondo transparente.
- server.test.mjs: pruebas de conexión simulada y protección de secretos. npm test ejecuta toda la suite sin gastar créditos.

## Primera versión de servicios

- `servicios.html`: entrada de servicios, traslados, seguros, guías locales, perfil local, ayuda y Mi viaje. El parámetro `seccion` elige la vista.
- `servicios.js`: catálogo de ejemplo, filtros, validación, cálculos, guardado y descarga de selecciones. Conserva una elección por tipo de servicio. Los cambios de formulario requieren pulsar «Ver opciones» antes de seleccionar de nuevo.
- `servicios.css`: presentación adaptable a móvil con la paleta original.
- `common.js` y `common.css`: enlaces compartidos, acceso a Rumbito y navegación entre páginas.
- `viajes.js`: catálogo único de los seis destinos, sus fotografías y presupuestos de inspiración; se carga antes de `script.js` en el inicio. Las tarifas de vuelos y hoteles se calculan por separado del presupuesto orientativo.

Rumbito ahora es un marcador de ubicación de expresión cercana. También puede abrir las nuevas páginas al preguntar por traslados, seguros o guías locales. Copán utiliza la fotografía local del sitio arqueológico, con créditos disponibles desde el catálogo de destinos.

### Almacenamiento y próxima integración

No hay base de datos, autenticación, proveedores ni pagos conectados. El perfil es un alias local, no una cuenta. Los seguros son ejemplos visuales y no activan ninguna cobertura.

Las claves `rumbo.services.v1` y `rumbo.profile.v1` guardan servicios y perfil. El módulo de viajes usa `rumbo.integrante2.viaje.v1`; la tienda conserva sus claves `rumbo.store.cart.v2` y `rumbo.store.favorites.v2`. Si el navegador bloquea el almacenamiento, los servicios ofrecen descargar la selección. Para compartir almacenamiento entre páginas, se recomienda abrir el servidor local en vez de `file://`.

Para integrar la base de datos después, sustituir los catálogos de muestra y las funciones de lectura/escritura local por consultas a una API, manteniendo la validación de capacidad, fechas y cantidades. La API deberá volver a calcular y validar precios y disponibilidad antes de crear reservas.
