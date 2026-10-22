# Rumbito con Groq

Rumbito usa Groq con el modelo predeterminado `openai/gpt-oss-20b`. La llave permanece en el servidor. La conexión real queda pendiente hasta configurar una llave válida y ejecutar el diagnóstico.

## Configurar la llave

1. Entra en https://console.groq.com/keys y crea una cuenta o inicia sesión.
2. Conserva el plan **Free**. Crea una API key (por ejemplo, con nombre Rumbito).
3. Abre **CONFIGURAR-GROQ.cmd** en la carpeta del proyecto. Pega la llave cuando la solicite y pulsa Enter; la entrada está oculta.
4. Abre **INICIAR-RUMBO.cmd**. Si el servidor ya estaba abierto al actualizar el código de Lightning a Groq, reinicia ese proceso Node una vez. Cambiar después la llave no requiere reinicio.
5. En una terminal del proyecto ejecuta `npm run chat:check`. El resultado esperado es **Conexión con Groq confirmada.**

El configurador conserva las demás variables de tu archivo privado. No copies .env.example sobre un .env existente: contiene también la configuración de base de datos y correo. No pegues la llave en el chat ni la subas a Git.

Configuración manual equivalente, solo en el servidor:

```dotenv
GROQ_API_KEY=tu_llave_de_groq
GROQ_MODEL=openai/gpt-oss-20b
```

Las variables antiguas LIGHTNING_API_KEY y RUMBITO_MODEL ya no se utilizan. En Hostinger configura GROQ_API_KEY y GROQ_MODEL en sus variables privadas y despliega el código actualizado; configurar la copia local no actualiza el sitio publicado.

## Funcionamiento y límites

PHP en el puerto 8000 deriva /api/chat al servidor Node en 3000; el lanzador inicia ambos. El modo portable utiliza su puerto configurado. También puedes usar `npm start` para iniciar Node directamente. Node debe ser 22.12 o posterior.

El plan Free de Groq tiene límites por minuto y por día, tanto de solicitudes como de tokens. Revisa los valores de tu cuenta en https://console.groq.com/docs/rate-limits. El código no activa facturación ni cambia tu plan; si tu cuenta ya tiene un plan de pago, se aplican sus condiciones.

Para reducir consumo, se envía una selección de hasta seis destinos y cuatro productos, hasta 4000 caracteres del historial reciente y un máximo de 1200 tokens de salida. El planificador sigue usando el catálogo completo y conserva sus cálculos y enlaces. La app limita a 200 intentos diarios por proceso y 12 consultas por minuto por IP; estos límites en memoria se reinician con el servidor. El límite del proveedor es independiente.

Si Groq falla, se conserva el modo catálogo y se informa que la IA no está disponible. El servidor espera hasta 15 segundos y pausa los reintentos durante 60 segundos tras un fallo del proveedor.

## Diagnóstico

`npm run chat:check` consulta el servidor local y consume una solicitud si la llave está configurada. Para comprobar otro origen usa `npm run chat:check -- https://tu-dominio.example` (sin barra final).

- AI_NOT_CONFIGURED: falta GROQ_API_KEY.
- AI_AUTH_FAILED: Groq rechazó la llave; revisa si está completa o revocada.
- AI_ACCESS_DENIED: revisa permisos de la cuenta y del modelo.
- AI_RATE_LIMITED: se alcanzó una cuota; espera antes de reintentar.
- AI_MODEL_UNAVAILABLE / AI_REQUEST_REJECTED: revisa el modelo configurado.
- AI_TIMEOUT / AI_CONNECTION_FAILED: comprueba conexión y disponibilidad.

El diagnóstico confirma una respuesta de Groq, no solo un HTTP 200 del catálogo. No muestra la llave ni errores privados del proveedor.

## Privacidad

Los mensajes y el contexto seleccionado se envían a Groq. La aplicación no guarda conversaciones en disco; el proveedor tiene sus propias políticas de datos. No introduzcas contraseñas, tarjetas ni documentos en el chat. .env está excluido de Git y el servidor bloquea su descarga; quien tenga acceso a tu carpeta puede leerlo.

Documentación oficial: https://console.groq.com/docs/quickstart y https://console.groq.com/docs/models.
