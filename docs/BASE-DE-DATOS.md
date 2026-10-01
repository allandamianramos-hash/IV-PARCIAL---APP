# SQL Server de Rumbo

> Para el arranque PHP actual y los pasos en SSMS, consulta [SQL-SERVER-PHP.md](SQL-SERVER-PHP.md). Este documento describe la API Node alternativa. Sus módulos están ahora en `backend/node/`, los recursos en `public/` y las pruebas de integración en `tests/integration/`.

Conexión instalada: `localhost`, base `BD_VIAJES`, autenticación de Windows.
La aplicación usa la identidad de Windows que ejecuta Node. No necesita la
contraseña de `sa`. El archivo exportado desde SSMS solo contenía la creación de
la base; no se ejecutó porque la base ya existía y no tenía tablas.

## Uso diario

1. Mantener activo el servicio SQL Server (MSSQLSERVER).
2. Abrir el proyecto con `INICIAR-RUMBO.cmd` o `npm start`.
3. Usar siempre `http://localhost:3000`, también al cambiar de página. `127.0.0.1`
   es otro origen para cookies y almacenamiento del navegador.
4. El indicador inferior confirma el guardado o permite reintentar. Abrir los
   HTML como archivos locales solo ofrece almacenamiento en el navegador.

La configuración privada está en `.env` (excluido de Git). `.env.example` explica
los campos. Se conservó la configuración existente del chat.
`DB_TRUST_CERTIFICATE=true` se usa exclusivamente para el certificado local.
En un despliegue con certificado válido, usar `false`, HTTPS, `APP_ORIGIN` y un
usuario de aplicación con permisos mínimos. No publicar el servidor de desarrollo.

El controlador Windows usa ODBC Driver 18. Si no se define `DB_PORT`, ODBC puede
usar memoria compartida para el servidor local. En este equipo TCP no respondió;
no fue necesario habilitarlo ni cambiar la configuración del servicio. Para un
servidor remoto, configurar TCP/puerto y los permisos de la cuenta correspondiente.

## Archivos y comandos

- `db.mjs`: pool privado de conexiones y configuración de autenticación.
- `database-api.mjs`: lectura de catálogos y estado; valida solicitudes y usa
  parámetros SQL, cookies HttpOnly y comprobación de origen.
- `database-client.js`: caché local, cola de cambios pendientes e indicador de guardado.
- `database/migrations/001_initial.sql`: primera estructura.
- `database/manage.mjs`: migraciones y carga inicial, siempre explícitas.

```powershell
npm install
npm run db:check
npm run db:migrate
npm run db:seed
npm start
```

Las tres operaciones de base ya se realizaron en este equipo. `db:migrate`
registra el nombre y checksum de cada migración y aplica las nuevas dentro de una
transacción. No se ejecutan migraciones al visitar una página. `db:seed` inserta
solo identificadores ausentes; nunca sobrescribe las ediciones existentes en SQL.

## Datos almacenados

- `RumboProducts`: 100 productos, precios, opciones y ajustes de variantes.
- `RumboDestinations`: 14 destinos, tarifas base y datos descriptivos.
- `RumboHotels`: 70 hoteles relacionados con su destino y tarifa por noche.
- `RumboSettings`: habitaciones, orígenes, promociones y tarifas de servicios.
- `RumboVisitors`: identificador de visitante y hash del token de su cookie.
- `RumboVisitorState`: documento JSON por visitante y función, con revisión y
  fecha de actualización. Sus claves son carrito, favoritos, viaje, servicios,
  perfil, resumen final, omisión del vuelo y lista de preparativos.
- `RumboMigrations`: historial de cambios de estructura.

Los campos variables se conservan como JSON validado para mantener las variantes
y selecciones actuales sin perder información. Las columnas `Name`, `Price`,
`Economy` y `Rate` son las fuentes de sus valores al consultar los catálogos.
Las fotos siguen en las carpetas del proyecto; SQL guarda sus rutas.
Los vuelos se calculan con las tarifas y promociones de SQL; no representan
inventario de aerolíneas. Los servicios conservan sus descripciones y fórmulas en
JavaScript y consultan sus tarifas en `RumboSettings`. Rumbito lee ese mismo catálogo;
sus conversaciones no se almacenan en SQL.

En SSMS: clic derecho en **BD_VIAJES → Refresh**, expandir **Tables**. Para comprobar:

```sql
USE BD_VIAJES;
SELECT COUNT(*) AS Productos FROM dbo.RumboProducts;
SELECT COUNT(*) AS Destinos FROM dbo.RumboDestinations;
SELECT COUNT(*) AS Hoteles FROM dbo.RumboHotels;
SELECT StateKey, Revision, UpdatedAt FROM dbo.RumboVisitorState;
SELECT Name, AppliedAt FROM dbo.RumboMigrations;
```

## Visitantes y funciones futuras

No se implementó registro/inicio de sesión. Los datos están asociados a una cookie
de este navegador; no hay acceso desde otro dispositivo ni recuperación después de
borrar esa cookie. El perfil no es una cuenta. Al recuperar conexión se importan
selecciones locales cuando aún no existen en el servidor. Si hay conflictos entre
pestañas, se avisa y se permite cargar la versión del servidor en lugar de
sobrescribirla silenciosamente. Elimina los cambios pendientes solo si eliges esa opción.

El resumen guardado continúa siendo un plan de demostración: no crea reservas,
pedidos cobrados, pagos ni comprobantes financieros. Los importes de los borradores
no deben utilizarse para cobrar. Antes de introducir pagos, hay que recalcular los
precios y disponibilidad en el servidor y crear pedidos y partidas normalizados.

Al incorporar cuentas, agregar una nueva migración para usuarios, credenciales
hasheadas, sesiones y la vinculación del visitante con el usuario; implementar
autenticación real y autorización por usuario. No guardar contraseñas en el JSON.

Para cada función futura, crear `002_descripcion.sql`, `003_descripcion.sql`, etc.,
actualizar API/interfaz y probar la migración. Nunca editar una migración aplicada
ni ejecutar nuevamente el `CREATE DATABASE` del archivo exportado. Los cambios de
catálogo posteriores a la carga inicial deben hacerse en SQL con scripts versionados;
editar solamente el catálogo de respaldo en JavaScript no actualiza filas existentes.
La base no cambia automáticamente por editar HTML o JavaScript.

## Comprobaciones

`npm test`: pruebas de la aplicación y validación de los nuevos datos.
`npm run db:test`: integración contra la base configurada (debe ser desarrollo).
Crea visitantes temporales y los elimina al terminar; verifica catálogo, aislamiento,
recuperación, rechazos por origen, revisiones, borrado y archivos privados.

Resultado de esta integración: las pruebas nuevas de persistencia y la prueba real
de SQL Server pasan. La suite general tiene cuatro fallos anteriores a este cambio:
`promociones.test.mjs` todavía espera Dolomitas, omite el descuento de grupo y exige
que la campaña sin precio no tenga etiqueta; `server.test.mjs` pide vuelos a Kioto,
que ya fue retirado del catálogo. Se comprobó el catálogo original de Git y no se
modificaron estos comportamientos para ocultar esas diferencias.
