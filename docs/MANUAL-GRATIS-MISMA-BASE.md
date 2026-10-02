# Conectar al equipo a la misma base, sin pagar alojamiento

## 1. Antes de comenzar — todos

1. Usen este manual en lugar del de Azure. La base se quedará en la computadora de Jimmy.
2. Cuenten a los integrantes: el plan Personal gratuito de Tailscale permite hasta 6 personas, incluyendo a Jimmy. Si son más, no contraten un plan para seguir este manual; habrá que elegir otra opción gratuita.
3. Acuerden las horas de trabajo. Durante esas horas, Jimmy debe mantener su computadora encendida, conectada a Internet y sin suspenderse. No hace falta mantener SSMS abierto.
4. Utilicen cuentas y datos de prueba para el proyecto escolar.
5. No creen una copia nueva de BD_VIAJES en cada computadora: todos se conectarán a la de Jimmy.

## 2. Preparar la conexión privada — Jimmy

1. Descarga Tailscale para Windows desde https://tailscale.com/download/windows.
2. Instálalo e inicia sesión con tu propia cuenta. Elige uso personal y el plan Personal gratuito; no elijas una prueba de un plan de pago.
3. Abre su panel de administración en https://login.tailscale.com/admin.
4. En Machines o Dispositivos, busca tu computadora. Copia su dirección IPv4 de Tailscale, parecida a 100.80.10.20. Esa dirección de ejemplo NO es la tuya.
5. En Users o Usuarios, elige invitar usuarios y crea una invitación para cada compañero como miembro normal, no administrador.
6. Envía a cada compañero su invitación en privado. No compartas tu contraseña de Tailscale.
7. Pídeles que completen el apartado 3 y te manden la dirección IPv4 de Tailscale de su computadora.
8. Comprueba en el panel que todas las computadoras estén conectadas a TU red. Si tu configuración exige aprobar dispositivos, aprueba únicamente los del equipo.

## 3. Entrar a la conexión privada — cada compañero

1. Acepta la invitación enviada por Jimmy con tu propia cuenta.
2. Instala Tailscale desde https://tailscale.com/download/windows.
3. Inicia sesión con la misma cuenta con la que aceptaste la invitación.
4. Comprueba que estás usando la red de Jimmy. Si aparecen varias redes, selecciona la de su equipo.
5. Copia la dirección IPv4 de Tailscale de TU computadora y envíasela a Jimmy. No le envíes la contraseña de tu cuenta.
6. Mantén Tailscale conectado durante el trabajo. No necesitas activar Exit Node ni compartir toda tu conexión a Internet.

## 4. Preparar SQL Server — Jimmy

1. Abre SSMS y conecta a localhost con autenticación de Windows.
2. Comprueba que aparece Databases → BD_VIAJES. No la borres ni vuelvas a crearla.
3. En New Query ejecuta esta consulta para ver tu edición:

```sql
SELECT SERVERPROPERTY('Edition') AS Edicion;
```

4. Para este proyecto de estudio, usa SQL Server Developer o Express, que tienen opciones gratuitas. Developer es para desarrollo y pruebas. Si tu edición es de evaluación o requiere licencia, no la reinstales encima de la base: primero respáldala y prepara una edición gratuita con ayuda.
5. Haz una copia antes de cambiar la configuración: clic derecho en BD_VIAJES → Tasks o Tareas → Back Up o Copia de seguridad → Full o Completa. Guarda el archivo en una carpeta de respaldo de tu computadora, fuera del proyecto que compartes.
6. Haz clic derecho en el nombre del servidor → Properties o Propiedades → Security o Seguridad.
7. Selecciona SQL Server and Windows Authentication mode. Acepta. Esto permitirá que cada compañero use una cuenta SQL propia.
8. Abre SQL Server Configuration Manager desde Inicio. Para SQL Server 2025 también puedes pulsar Windows+R y escribir SQLServerManager17.msc.
9. Abre SQL Server Network Configuration → Protocols for MSSQLSERVER. En esta computadora la instancia se llama MSSQLSERVER.
10. Haz doble clic en TCP/IP y pon Enabled en Yes.
11. En Protocol, usa Listen All = Yes. En IP Addresses, ve al final a IPAll, deja TCP Dynamic Ports vacío y escribe 1433 en TCP Port. Si ese puerto ya lo usa otro servicio, detente y elige otro puerto con ayuda; deberán usar el mismo puerto en todos los pasos siguientes.
12. Acepta. En SQL Server Services, haz clic derecho en SQL Server (MSSQLSERVER) → Restart. Hazlo cuando nadie esté guardando datos: el reinicio corta las conexiones por un momento.
13. No necesitas activar SQL Server Browser porque todos usarán una dirección y un puerto concretos.

## 5. Permitir solo las computadoras del equipo — Jimmy

1. Pulsa Windows+R, escribe wf.msc y acepta. Abre la herramienta con permisos de administrador si Windows lo pide.
2. En Reglas de entrada elige Nueva regla → Personalizada.
3. En Programa deja Todos los programas. En Protocolo selecciona TCP; en Puerto local selecciona Puertos específicos y escribe 1433. El puerto remoto queda como cualquiera.
4. En Ámbito, en direcciones IP locales, elige Estas direcciones IP y agrega SOLO tu dirección de Tailscale del apartado 2.
5. En direcciones IP remotas, elige Estas direcciones IP y agrega SOLO las direcciones de Tailscale de las computadoras de tus compañeros.
6. Elige Permitir la conexión. Aplica la regla a los tres perfiles de Windows para que funcione con el perfil que use Tailscale; el acceso ya está limitado a las direcciones que anotaste.
7. Ponle el nombre Rumbo SQL por Tailscale y finaliza.
8. Revisa si ya hay otra regla que permita el puerto 1433 o SQL Server desde cualquier dirección. Limita esa regla también al equipo si fue creada para este proyecto. Si pertenece a otro servicio que utilizas, pide ayuda antes de cambiarla.
9. No desactives el firewall. No abras puertos en el router ni uses la dirección pública de tu casa.
10. Si un compañero cambia de computadora, actualiza la lista de direcciones permitidas.

## 6. Dar una cuenta SQL a cada compañero — Jimmy

1. En SSMS, conectado como administrador, abre Security o Seguridad → Logins o Inicios de sesión.
2. Clic derecho → New Login o Nuevo inicio de sesión.
3. Escribe un nombre único, por ejemplo rumbo_ana. Selecciona SQL Server authentication.
4. Escribe una contraseña larga y diferente para esa persona. Mantén activada la comprobación de contraseña segura. Desmarca la obligación de cambiarla en el próximo inicio, porque PHP no puede completar ese cambio.
5. En Default database selecciona BD_VIAJES.
6. En User Mapping o Asignación de usuarios marca solamente BD_VIAJES.
7. Para esa base marca db_datareader y db_datawriter. No marques db_owner ni sysadmin. Estas cuentas podrán leer y modificar los datos de la base del proyecto, pero no cambiar su estructura.
8. Acepta. Repite con una cuenta distinta para cada compañero.
9. No les entregues la cuenta sa ni tu cuenta de administrador. No uses el archivo CREAR_USUARIO_EQUIPO.sql del manual de Azure: para esta opción sigue los pasos de SSMS de este apartado.
10. Cuando alguien deje de participar, desactiva su inicio de sesión SQL y retira su acceso a Tailscale.

## 7. Lo que Jimmy debe entregar a cada compañero

1. Su invitación de Tailscale.
2. La dirección IPv4 de Tailscale de la computadora de Jimmy.
3. El puerto SQL: 1433, si seguiste este manual.
4. El nombre de la base: BD_VIAJES.
5. Su usuario SQL individual y su contraseña, por un medio privado.
6. Este manual y el proyecto actualizado por Git o ENTREGA-RUMBO.zip.
7. Un mensaje indicando a qué horas estará encendida la computadora.
8. No envíes tu archivo .env, tus contraseñas personales ni la copia de seguridad de la base en el ZIP.

## 8. Comprobar acceso a la misma base — cada compañero

1. Comprueba que Jimmy tiene encendida su computadora y que ambos tienen Tailscale conectado.
2. Instala SQL Server Management Studio desde la página oficial de Microsoft. Es gratuito. No necesitas instalar el motor SQL Server en tu computadora para conectarte al de Jimmy.
3. Abre PowerShell y ejecuta lo siguiente, sustituyendo DIRECCION_DE_JIMMY por la dirección real de Tailscale que te dio:

```powershell
Test-NetConnection DIRECCION_DE_JIMMY -Port 1433
```

4. Debe aparecer TcpTestSucceeded: True. Si aparece False, Jimmy debe revisar TCP/IP, el puerto, la regla del firewall y que ambas computadoras estén en su red de Tailscale.
5. Abre SSMS. En Server name escribe la dirección seguida de coma y puerto. Por ejemplo, 100.80.10.20,1433, pero usando la dirección REAL de Jimmy.
6. Selecciona SQL Server Authentication. Escribe el usuario SQL y la contraseña que te entregó Jimmy.
7. Mantén el cifrado activado. Si SQL Server usa su certificado local y SSMS lo rechaza, marca Trust server certificate para esta conexión privada de desarrollo por Tailscale. No uses esa excepción para una web pública.
8. Conecta y abre Databases → BD_VIAJES.
9. Pulsa New Query y ejecuta:

```sql
USE BD_VIAJES;
SELECT @@SERVERNAME AS Servidor, DB_NAME() AS Base;
SELECT COUNT(*) AS Productos FROM dbo.RumboProducts;
SELECT COUNT(*) AS Cuentas FROM dbo.RumboUsers;
```

10. Comparen los resultados: todos deben ver el mismo servidor, la misma base y los mismos conteos si nadie los está cambiando en ese momento.
11. Si aparece Login failed, revisen la cuenta, la contraseña, el modo de autenticación del apartado 4 y la asignación de BD_VIAJES del apartado 6.
12. Al llegar aquí ya están conectados a la misma base. Para conectar también la página, continúen con el apartado 9.

## 9. Conectar la página y Live Server — cada compañero

1. Descomprime el proyecto en una carpeta normal. No lo ejecutes dentro del ZIP.
2. Instala VS Code, Live Server de Ritwick Dey, XAMPP con PHP 8.2 TS de 64 bits, Microsoft ODBC Driver 18 de 64 bits y Node.js 22 o posterior. Estos programas tienen opciones gratuitas. No necesitas iniciar MySQL.
3. Abre en VS Code la carpeta principal del proyecto, la que contiene public, backend y .vscode.
4. Crea un archivo llamado .env en esa carpeta principal. No lo llames .env.txt.
5. Pega esta configuración y sustituye los tres valores CAMBIAR por tus datos reales:

```dotenv
DB_ENABLED=true
DB_SETUP_MODE=check
DB_SERVER=CAMBIAR_POR_IP_TAILSCALE_DE_JIMMY
DB_PORT=1433
DB_NAME=BD_VIAJES
DB_AUTH=sql
DB_USER=CAMBIAR_POR_TU_USUARIO_SQL
DB_PASSWORD="CAMBIAR_POR_TU_CONTRASENA_SQL"
DB_ODBC_DRIVER=ODBC Driver 18 for SQL Server
DB_TRUST_CERTIFICATE=true
```

6. No pongas localhost ni la dirección de TU computadora en DB_SERVER. Todos ponen la dirección de Jimmy. No agregues el puerto en DB_SERVER: ya está en DB_PORT.
7. Deja DB_SETUP_MODE=check para no intentar instalar otra base. No ejecutes ningún instalador SQL ni el archivo de Azure.
8. No agregues PHP_APP_ORIGIN para este uso local con Live Server. No compartas tu .env.
9. Abre Terminal → Nueva terminal en VS Code y ejecuta npm install.
10. Ejecuta CONFIGURAR-PHP.cmd. Después ejecuta COMPROBAR-CONEXION.cmd. Debe indicar LecturaYEscritura: OK.
11. Pulsa Ctrl+Shift+B en VS Code. Espera a que termine la comprobación y arranque PHP. También puedes ejecutar INICIAR-RUMBO.cmd.
12. Detén Live Server si ya estaba abierto y vuelve a pulsar Go Live. Conserva la carpeta .vscode que viene con el proyecto.
13. Usa http://127.0.0.1:5500/index.html. Live Server envía la página a tu PHP local, y ese PHP guarda en la base de Jimmy.
14. Registra una cuenta de prueba en la página y guarda una selección. Espera Guardado en SQL Server.
15. Mantén PHP y Tailscale funcionando mientras uses la página. La conexión necesita que la computadora de Jimmy siga encendida.

## 10. Demostrar que un cambio lo ven todos — todos

1. La persona A registra una cuenta de prueba con un correo fácil de identificar y guarda un favorito o un perfil.
2. Espera el mensaje Guardado en SQL Server.
3. La persona B, conectada por SSMS a la base de Jimmy, abre database/CONSULTAR_DATOS.sql y pulsa F5.
4. B debe ver la cuenta y los datos guardados por A. Jimmy también podrá verlos ejecutando esa consulta en su SSMS.
5. A realiza otro cambio. B y Jimmy vuelven a pulsar F5 para consultarlo. Una pestaña ya abierta no se actualiza sola.
6. Para recuperar las selecciones propias desde otra computadora, inicia sesión con la misma cuenta de la página. No esperes ver el carrito de otra persona desde una cuenta distinta: los carritos y perfiles están separados por usuario.
7. No confundan las cuentas: la cuenta SQL conecta PHP con la base; la cuenta creada en la página identifica a la persona que está utilizando Rumbo.

## 11. Trabajar juntos cada día — todos

1. Jimmy enciende su computadora, conecta Tailscale y comprueba que el servicio SQL Server esté iniciado.
2. Cada compañero conecta Tailscale, abre el proyecto, inicia PHP con Ctrl+Shift+B y abre Go Live.
3. Antes de cerrar, espera Guardado en SQL Server. Si hay un error, conserva los datos del navegador y revisa la conexión.
4. Para ver cambios de otros, vuelve a ejecutar la consulta o recarga la página.
5. Comparte cambios de HTML, PHP y JavaScript por Git. La base compartida no actualiza automáticamente los archivos de los compañeros.
6. Si necesitan nuevas tablas o columnas, una persona prepara la nueva migración y Jimmy la aplica una sola vez, después de revisar el respaldo. No borren ni reinstalen la base para actualizarla.
7. Jimmy avisa antes de reiniciar, suspender o apagar su computadora. Mientras esté apagada, los demás no podrán consultar ni guardar.

## 12. Si aparece ECONNREFUSED 127.0.0.1:8000

1. Abre la carpeta completa del proyecto en VS Code.
2. Pulsa Ctrl+Shift+B para iniciar PHP. También puedes abrir INICIAR-RUMBO.cmd con doble clic.
3. Espera el mensaje PHP y SQL Server disponibles: http://localhost:8000.
4. Abre http://localhost:8000 en el navegador. Comprueba que aparezca Guardado en SQL Server.
5. Detén Go Live y vuelve a iniciarlo. Recarga la página.
6. Si el paso 3 muestra un error de conexión SQL, comprueba Tailscale, que la computadora de Jimmy esté encendida y los datos del archivo .env. Ejecuta COMPROBAR-CONEXION.cmd.
7. Repite el paso 2 después de reiniciar tu computadora. Live Server necesita PHP en funcionamiento para guardar en SQL Server; abrir solamente el HTML no inicia PHP.

## 13. Enlaces de descarga y comprobación

1. Tailscale para Windows: https://tailscale.com/download/windows
2. Límite del plan gratuito: https://tailscale.com/docs/reference/free-plans-discounts
3. SSMS gratuito: https://learn.microsoft.com/en-us/ssms/install/install
4. SQL Server Developer/Express: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
5. VS Code: https://code.visualstudio.com/download
6. XAMPP: https://www.apachefriends.org/download.html
7. ODBC Driver 18: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
8. Node.js: https://nodejs.org/en/download
9. Configuración SQL de autenticación: https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/change-server-authentication-mode
10. Configuración SQL de firewall: https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access
