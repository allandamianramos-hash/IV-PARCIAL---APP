# Conexión de Rumbo a Azure SQL

Servidor: `rumbo-2026.database.windows.net`  
Base: `BD_VIAJES`  
Puerto: `1433`  
Cifrado: obligatorio, con validación del certificado.

## Abrir el proyecto

Abre el proyecto en Visual Studio Code y pulsa **Go Live**. Live Server usa
http://127.0.0.1:5500 y envía las solicitudes a PHP en segundo plano, sin cambiar
la dirección del navegador. La tarea de apertura prepara PHP; si no se ejecuta,
usa Ctrl+Shift+B una vez. Reinicia Live Server después de cambiar su configuración.
Usa siempre el mismo nombre de host: `localhost` y `127.0.0.1` tienen cookies
y almacenamiento de navegador independientes.

## Conectar desde SSMS

1. Selecciona el motor de base de datos y el servidor indicado arriba.
2. Usa **Autenticación de SQL Server**, no autenticación de Windows.
3. Usa el usuario y contraseña de `DB_USER` y `DB_PASSWORD` en el `.env` privado.
4. En las propiedades de conexión, especifica `BD_VIAJES` como base.
   El usuario de aplicación está contenido en esa base y no administra `master`.
5. Mantén el cifrado obligatorio y desmarca «Confiar en el certificado del servidor».

Para tareas administrativas, usa `rumbo-sql` y la contraseña que restableciste
en Azure. La aplicación debe usar su cuenta limitada.

## Migración y recuperación

La copia compara las claves y el contenido, conserva las filas existentes e
inserta las faltantes en una transacción. Si encuentra contenido incompatible,
se detiene. Los contadores de guardado conservan el mayor valor cuando el
contenido es idéntico. No copia el historial local de bloqueos de acceso.

`database/azure-migrate.mjs` admite `check`, `compare` y `copy`. La copia exige
que la configuración siga apuntando al origen local. No la vuelvas a ejecutar
con la aplicación ya configurada para Azure. La base local se conserva.

Los respaldos privados de ambas bases y de la configuración anterior están
en `.runtime/`. Contienen información de cuentas y no se deben compartir ni
incluir en una entrega. `.env` y `.runtime/` están excluidos de Git.

## Red y comprobaciones

El 4 de octubre de 2026 se autorizó la IP individual `168.181.123.147` con la
regla `ClientIPAddress_2026-10-4_12-42-14`. Se verificaron lectura y escritura
en `BD_VIAJES`, además de catálogo y sesión a través de Live Server sin redirección.
Si la conexión pública cambia, será necesario revisar la IP que Azure rechaza.

La regla `Rumbo-PC-SQL` autoriza el rango `168.228.44.0–168.228.44.255`, aprobado
por el propietario después de observar distintas IP de salida. Si cambias de
red y Azure muestra otra IP bloqueada, revisa la regla en **Servidor → Redes**.
No habilites todas las direcciones ni desactives el cifrado para resolverlo.

Ejecuta `COMPROBAR-CONEXION.cmd` para comprobar lectura y escritura con una
transacción temporal que se revierte. `npm run php:test` prueba registro,
login, cierre de sesión, persistencia y aislamiento con cuentas temporales.

Las reservas, pagos y billetes del proyecto siguen siendo demostraciones.
Los usuarios y las selecciones sí se almacenan en SQL Server.

Referencia: [Conexión a Azure SQL desde SSMS](https://learn.microsoft.com/en-us/azure/azure-sql/database/connect-query-ssms?view=azuresql).
