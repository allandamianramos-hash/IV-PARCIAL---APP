# SQL Server y PHP: paso a paso

**Actualización: Live Server ya está configurado para enviar todas las páginas a PHP.** Para trabajar con una sola base alojada, utiliza [MANUAL-PARA-EL-EQUIPO.html](MANUAL-PARA-EL-EQUIPO.html). Abre la carpeta principal en VS Code, inicia PHP con Ctrl+Shift+B y detén/vuelve a iniciar Go Live. La guía siguiente conserva las instrucciones de instalación local.

## Qué significa «guardado solo en este navegador»

Significa que esos cambios todavía no están confirmados en SQL Server. Pueden existir únicamente en el almacenamiento local del navegador. No borres los datos del navegador mientras haya cambios pendientes.

Con la configuración anterior, el puerto **5500** era una vista estática sin conexión. La configuración actual lo comunica con PHP en **8000**. Live Server no ejecuta PHP por sí mismo: PHP debe estar iniciado. El arranque comprueba configuración, tablas, catálogo, lectura/escritura y que el HTML servido confirme la conexión.

El mensaje **Guardado en SQL Server** confirma que no hay cambios pendientes en esa página. Si falla SQL, el aviso conserva esa distinción y los cambios quedan pendientes. Puedes ejecutar **COMPROBAR-CONEXION.cmd** para comprobar lectura y escritura mediante una operación temporal que se revierte.

`localhost:5500`, `localhost:8000`, `127.0.0.1:8000` y los archivos abiertos con doble clic usan almacenamientos del navegador separados. Los datos que ya guardaste solo en otra dirección no se trasladan automáticamente al abrir localhost:8000. Conserva la pestaña original y vuelve a introducir esas selecciones en la versión conectada; no borres la caché para intentar arreglarlo. Una cuenta recupera en cualquier navegador los datos que sí llegaron a la misma base SQL.

## ¿Bastan los archivos PHP para mis compañeros?

**No.** Los PHP son código: necesitan un proceso PHP que los ejecute, el controlador PDO_SQLSRV y acceso a un motor SQL Server con la base instalada. El navegador no ejecuta PHP y los archivos no sustituyen la base de datos. XAMPP aporta PHP; SQL Server almacena los registros; SSMS permite administrarlos; `.env` indica dónde conectar; el instalador SQL crea las tablas.

Hay dos formas de trabajar:

- **Cada compañero desarrolla en su computadora:** instala los requisitos del apartado 3 y usa su base local. Con Git comparten código y migraciones; no usuarios ni registros nuevos.
- **Todos utilizan una web central:** una computadora o alojamiento ejecuta PHP y accede a una base SQL común. Los compañeros solo necesitan el navegador y la dirección de esa web. Para habilitar esto todavía se debe elegir el servidor, configurar acceso de red y publicar el sitio adecuadamente; localhost apunta a la computadora de cada persona.

Node se usa para el asistente y para comprobar contraseñas de cuentas antiguas creadas por Node. El registro nuevo y el guardado de datos los realiza PHP. El arranque permite continuar con PHP si el asistente falla, pero para conservar todas las funciones instala también Node y ejecuta npm install.

## 1. En esta computadora

Ya está configurado PHP 8.2 de XAMPP con PDO_SQLSRV y `BD_VIAJES` en `localhost`, usando tu cuenta de Windows. No necesitas MySQL ni pegar contraseñas en PHP.

1. Ejecuta **INICIAR-RUMBO.cmd** en la raíz.
2. Entra a **http://localhost:8000**.
3. Pulsa Registrarse, crea tu cuenta y selecciona productos, favoritos, viaje o servicios.
4. Espera el mensaje **Guardado en SQL Server**.
5. Cierra sesión y vuelve a entrar: se recuperarán los datos de tu cuenta.

SSMS administra la base; el motor SQL Server almacena los datos aunque cierres SSMS. PHP recibe solicitudes del navegador y ejecuta consultas preparadas. El `.sql` instala la estructura: el guardado ocurre en SQL Server, no editando ese archivo.

## 2. Comprobar los datos en SSMS

1. Abre SSMS y conecta a `localhost` con **Windows Authentication**.
2. Despliega **Databases → BD_VIAJES → Tables**. Clic derecho en Tables → **Refresh** si hace falta.
3. Verás `dbo.RumboUsers`, `dbo.RumboSessions`, `dbo.RumboVisitorState` y las tablas del catálogo. Se conservaron las tablas anteriores de tu base.
4. Pulsa **New Query**, pega estas consultas y pulsa **F5**:

```sql
USE BD_VIAJES;
SELECT Id, FullName, Email, CreatedAt
FROM dbo.RumboUsers ORDER BY CreatedAt DESC;

SELECT u.Email, s.StateKey, s.DataJson, s.Revision, s.UpdatedAt
FROM dbo.RumboUsers AS u
JOIN dbo.RumboVisitorState AS s ON s.VisitorId = u.VisitorId
ORDER BY s.UpdatedAt DESC;

SELECT COUNT(*) AS Productos FROM dbo.RumboProducts;
SELECT COUNT(*) AS Destinos FROM dbo.RumboDestinations;
SELECT COUNT(*) AS Hoteles FROM dbo.RumboHotels;
```

Tras registrar una cuenta aparecerá en RumboUsers. Tras guardar elecciones aparecerán filas vinculadas en RumboVisitorState. Las claves `rumbo.store.cart.v2`, `rumbo.store.favorites.v2`, `rumbo.profile.v1`, etc., identifican cada selección. Las contraseñas son hashes. Las selecciones se guardan como JSON validado en SQL Server; todavía no hay un sistema de pedidos/cobros reales.

## 3. Instalar en la computadora de cada compañero

Necesitan el **motor SQL Server 2022 o posterior**, SSMS, PHP **8.2 Thread Safe x64** (por ejemplo XAMPP), **Microsoft ODBC Driver 18 x64** y Node.js **22 o posterior**. La migración utiliza funciones JSON de SQL Server 2022+. SSMS por sí solo no instala el motor. Para otro PHP, habría que adaptar `scripts/php-runtime.ps1` a su DLL compatible.

1. Comparte el proyecto por Git o ejecuta **PREPARAR-ENTREGA.cmd** y comparte `ENTREGA-RUMBO.zip`. Conserva las carpetas. El ZIP excluye `.env`, `.runtime`, `node_modules`, `.git`, registros y datos de usuarios.
2. En la otra computadora, abre SSMS y conecta usando Windows Authentication. El servidor suele ser `localhost` o `localhost\SQLEXPRESS`: utiliza el que permita conectarte.
3. Selecciona **File → Open → File** y abre `database/INSTALAR_BD_VIAJES.sql`.
4. Pulsa **F5**. Crea BD_VIAJES si falta, aplica migraciones pendientes e inserta el catálogo inicial. Puede repetirse; conserva registros existentes y verifica las migraciones. Requiere permisos para crear/modificar la base.
5. Copia `.env.example` como `.env` en la raíz. Configura:

```dotenv
DB_ENABLED=true
DB_SERVER=localhost
DB_NAME=BD_VIAJES
DB_AUTH=windows
DB_ODBC_DRIVER=ODBC Driver 18 for SQL Server
DB_TRUST_CERTIFICATE=true
```

Si la instancia es SQLEXPRESS, escribe `DB_SERVER=localhost\SQLEXPRESS`. Usa el mismo usuario de Windows que pudo entrar en SSMS. La opción TrustCertificate es para el certificado autofirmado del desarrollo local.

6. Abre una terminal en la raíz y ejecuta **npm install**.
7. Ejecuta **CONFIGURAR-PHP.cmd**. Descarga el controlador oficial verificado, aplica el instalador si falta algo y comprueba la conexión. No modifica el php.ini global. Si SQL falla, corrige `.env` y repite.
8. Ejecuta **INICIAR-RUMBO.cmd** y visita **http://localhost:8000**.
9. Registra una cuenta y comprueba en SSMS las consultas del apartado 2.

Cada configuración privada permanece en su `.env`. Para utilizar la IA, cada equipo configura su propia clave; el almacenamiento no necesita esa clave.

## 4. Misma estructura frente a mismos datos

Si todos instalan BD_VIAJES en sus computadoras, tendrán el mismo esquema y catálogo inicial, pero **usuarios y selecciones independientes**. Git y el archivo SQL no sincronizan nuevos registros.

Para que todos vean exactamente los mismos datos, deben conectarse a **una sola instancia compartida de SQL Server**. Primero hay que elegir qué computadora/servidor la alojará; después configurar red, permisos por usuario y el mismo DB_SERVER. Para equipos remotos, usar red privada/VPN o servicio administrado. La configuración entregada es local: no abre SQL Server a Internet ni concede permisos remotos automáticamente.

## 5. Mantener ordenados los cambios

- Conexión: `backend/php/conexion.php`, valores privados en `.env`.
- Registro y sesiones: `backend/php/auth.php`.
- Catálogo y guardado: `backend/php/datos.php`.
- Rutas y archivos públicos permitidos: `router.php`.
- Páginas: `public/`.
- Estructura SQL: `database/migrations/`.

Al agregar una función, crea su migración numerada, validación y endpoint si lo necesita. No edites migraciones ya aplicadas. Ejecuta `npm run db:export`, luego `CONFIGURAR-PHP.cmd`, y comparte código y migración juntos. El catálogo inicial solo agrega filas inexistentes: cambios de precios o registros existentes requieren una migración con UPDATE explícitos. El instalador contiene esquema y catálogo; no exporta cuentas ni sus datos privados.

## 6. Problemas frecuentes

- **Modo local / no se guarda:** abre INICIAR-RUMBO.cmd, no `file://` ni Live Server. `http://localhost:8000/api/database` debe indicar `connected: true`.
- **Login failed:** comprueba permisos del mismo usuario de Windows en SSMS. El administrador debe asignarlos; no es necesario compartir la contraseña de `sa`.
- **Servidor no encontrado:** revisa el servicio SQL Server y DB_SERVER en `.env`.
- **Falta PDO_SQLSRV:** ejecuta CONFIGURAR-PHP.cmd y verifica PHP 8.2 TS x64 y ODBC 18 x64.
- **PHP no inicia:** revisa `.runtime/php-errors.log` y el puerto 8000.
- **Cambios más recientes:** recarga la versión guardada antes de sobrescribir otra pestaña.
- **Demasiados intentos:** espera 15 minutos; registro/login limitan intentos repetidos.

Este arranque es local. Publicar requiere servidor web con HTTPS, cuenta SQL de permisos limitados, copias de seguridad y configuración de producción. No hay recuperación de contraseña ni verificación de correo todavía.

Referencias: [requisitos oficiales de Microsoft](https://learn.microsoft.com/en-us/sql/connect/php/system-requirements-for-the-php-sql-driver) y [controlador Microsoft 5.12.0](https://github.com/microsoft/msphpsql/releases/tag/v5.12.0), compatible con el PHP 8.2 usado aquí.
- Para usar Live Server: sigue el manual nuevo y conserva .vscode/settings.json. La apertura mediante file:// sigue siendo una vista estática.
