# Rumbo: manual para trabajar juntos

Este manual explica cómo abrir el proyecto desde Visual Studio Code y cómo conectar a todos a UNA SOLA base de datos por Internet. Está pensado para un equipo de estudiantes que trabaja desde distintas casas.

## 1. Qué está listo y qué falta

Ya están preparados los archivos del proyecto, PHP, las tablas, el registro, el inicio de sesión y el guardado de las selecciones. También está preparada la configuración para usar Live Server. Se comprobó Live Server con PHP y SQL Server en la computadora de Jimmy.

Todavía falta crear el servicio de base de datos compartida y entregar a cada persona sus datos de conexión. Este manual no significa que ya haya una base contratada en Internet. Hasta cambiar la configuración, la computadora de Jimmy sigue conectada a su base local.

La opción que explicamos es **Azure SQL Database**, el servicio de base de datos de Microsoft. Antes de crearlo, revisen el costo que muestra Microsoft y elijan quién administrará la cuenta y pagará, si corresponde. No se promete que sea gratis. Si la universidad ya les ofrece SQL Server, pregunten primero: pueden utilizarlo y pedir al encargado el servidor, puerto, base y una cuenta para cada integrante.

## 2. Qué hace cada parte, explicado fácil

- **Visual Studio Code:** sirve para editar el proyecto.
- **Live Server:** abre el sitio y envía sus solicitudes a PHP. Por sí solo no ejecuta PHP.
- **PHP:** recibe lo que la página pide guardar o consultar y habla con la base.
- **SQL Server o Azure SQL:** es donde quedan guardados los datos.
- **SSMS:** es el programa para ver y administrar las tablas.
- **PDO_SQLSRV y ODBC:** son las piezas que permiten la comunicación entre PHP y SQL Server.
- **El archivo .env:** contiene la dirección del servidor, el nombre de la base y los datos de acceso de esa computadora. Es privado.
- **Git:** comparte los archivos del proyecto. No comparte automáticamente los registros de la base.

En cada computadora el recorrido será: navegador → Live Server → PHP → la misma base de Internet. Cada persona tendrá su propia copia del código, pero todos escribirán en la misma base.

## 3. Por qué antes aparecía guardado solo en el navegador

Antes Live Server solo enviaba las peticiones de /api al servidor Node. Las páginas se abrían sin pasar por PHP y no recibían la información necesaria para guardar en SQL Server.

La configuración nueva envía TODO el sitio a PHP. Está guardada en .vscode/settings.json. La dirección que abre Live Server sigue siendo http://127.0.0.1:5500. PHP trabaja detrás en http://127.0.0.1:8000.

Es necesario detener Live Server y volver a iniciarlo para que tome la configuración nueva. Abran la carpeta principal del proyecto, no solamente public. No borren la carpeta .vscode al copiar el proyecto.

## 4. Acuerdos que deben hacer antes de empezar

1. Elijan a una persona responsable de la base compartida.
2. Esa persona crea la base, aplica cambios a las tablas, administra accesos y revisa las copias de seguridad.
3. Cada integrante tendrá su propia cuenta de conexión. No compartan la cuenta del administrador.
4. Usen información de prueba mientras desarrollan. Las personas con acceso de desarrollo a SQL pueden consultar los datos del proyecto.
5. Todos usarán la base llamada BD_VIAJES del MISMO servidor. Que dos bases tengan el mismo nombre no significa que sean la misma base.

## 5. Crear la base en Azure: solo lo hace el responsable

1. Entren en https://portal.azure.com con la cuenta elegida por el equipo.
2. Busquen SQL databases o Bases de datos SQL y elijan Crear.
3. Elijan la suscripción disponible y creen un grupo para el proyecto, por ejemplo RumboEquipo.
4. Escriban BD_VIAJES como nombre de la base.
5. En Servidor, creen uno nuevo. Microsoft pide un nombre que no esté ocupado. Anoten la dirección completa que entregue, parecida a nombre-del-equipo.database.windows.net. El ejemplo no es un servidor real.
6. Configuren una cuenta de administrador y una contraseña larga y única. Para seguir este manual necesitan que el servidor permita autenticación SQL, es decir, entrar con usuario y contraseña SQL. No guarden esa contraseña en Git, capturas ni documentos que envíen al grupo.
7. Elijan una capacidad adecuada para un proyecto pequeño y revisen el costo estimado antes de confirmar. Si eligen una opción que se pausa por inactividad, la primera conexión puede tardar: esperen a que se reactive y vuelvan a intentar.
8. En redes o networking, permitan conexión por el punto de acceso público, pero únicamente desde direcciones autorizadas. Agreguen la dirección pública actual del responsable con Agregar IP del cliente.
9. No creen una regla que permita todas las direcciones de Internet. Más adelante agregarán las direcciones exactas de cada compañero.
10. Revisen los datos y creen el servicio. Esperen a que Azure indique que está listo.

Los nombres de los botones pueden aparecer en español o inglés. La guía oficial enlazada al final incluye el recorrido del portal.

## 6. Instalar las tablas: solo el responsable

1. Abran SQL Server Management Studio.
2. En nombre del servidor escriban la dirección completa entregada por Azure.
3. Seleccionen autenticación de SQL Server e introduzcan la cuenta de administrador.
4. Mantengan el cifrado activado y la opción de confiar sin comprobar el certificado desactivada.
5. En Opciones o Propiedades de conexión, escriban BD_VIAJES como base a la que se conectarán. No dejen master cuando utilicen usuarios de la base.
6. Conéctense. Si el acceso está bloqueado, revisen primero que Azure permita su dirección pública actual.
7. Abran database/INSTALAR_BASE_COMPARTIDA.sql del proyecto. Este es el archivo preparado para una base que ya existe en Azure. No usen INSTALAR_BD_VIAJES.sql, porque ese otro archivo intenta crear una base local.
8. Comprueben que la consulta esté conectada a BD_VIAJES y pulsen F5.
9. Al terminar deben aparecer 100 productos, 14 destinos y 70 hoteles.

Este archivo instala las tablas Rumbo y el catálogo inicial. No sube los usuarios, sesiones ni selecciones que ya existen en la computadora de Jimmy, ni todas las tablas antiguas de su base. Para empezar juntos pueden crear cuentas de prueba nuevas. Si necesitan trasladar datos anteriores, deben planificar una exportación de esos datos aparte.

## 7. Crear una cuenta SQL para cada compañero: solo el responsable

1. En SSMS, conectado como administrador a BD_VIAJES, abran database/CREAR_USUARIO_EQUIPO.sql.
2. Cambien CAMBIAR_USUARIO por un nombre diferente para cada persona, por ejemplo rumbo_ana.
3. Cambien CAMBIAR_CONTRASENA por una contraseña larga, única, de al menos 16 caracteres. Si incluyen una comilla simple en el texto SQL, se escribe dos veces dentro del texto entre comillas.
4. Pulsen F5. El archivo se niega a continuar si dejaron los valores de ejemplo.
5. Repitan con otro nombre y otra contraseña para cada integrante.
6. Entreguen a cada persona únicamente su propia contraseña, por un medio privado. No la pongan en el manual ni en el ZIP. Cierren el archivo sin guardar las contraseñas reales.

Estas cuentas permiten consultar y modificar los datos de las tablas Rumbo. No permiten cambiar su estructura ni administrar otras bases. Si alguien deja el equipo, el responsable debe retirar su acceso.

La cuenta SQL NO es la misma cuenta de registro de la página. La cuenta SQL permite que PHP se conecte. Cada usuario de la web crea después su cuenta normal con nombre, correo y contraseña.

## 8. Autorizar la conexión desde cada casa: lo hace el responsable

1. Cada compañero obtiene su dirección IP pública actual. Es la dirección de salida a Internet de su casa, no la dirección 192.168... de su computadora.
2. El responsable abre el servidor de Azure, entra en Redes y agrega una regla con esa misma dirección como inicio y final.
3. Guarda el cambio y espera un momento antes de volver a probar.
4. Si un compañero cambia de casa, de red o su proveedor cambia su dirección, puede ser necesario actualizar esa regla.

No hay que abrir el router de casa ni publicar el SQL Server de Jimmy. La base estará alojada en el servicio compartido. Si usan el servidor de la universidad, sigan sus instrucciones de acceso; puede requerir conectarse a la red privada de la institución.

## 9. Preparar la computadora: lo hace cada compañero una vez

1. Descarguen y descompriman ENTREGA-RUMBO.zip, o descarguen el proyecto por Git. Trabajen en una carpeta normal, fuera del ZIP.
2. Instalen Visual Studio Code y la extensión Live Server de Ritwick Dey.
3. Instalen PHP 8.2 Thread Safe de 64 bits. El proyecto está preparado para el PHP de XAMPP en C:\xampp\php\php.exe. No hace falta iniciar MySQL. Si ya usan otra versión de PHP, no mezclen controladores: pidan ayuda para adaptar la versión.
4. Instalen Microsoft ODBC Driver 18 de 64 bits para SQL Server.
5. Instalen Node.js 22 o posterior. El proyecto lo utiliza para Rumbito y para cuentas antiguas. No sustituye PHP ni la base.
6. Instalen SSMS si también van a ver o editar las tablas. No necesitan instalar el motor SQL Server en su computadora cuando van a utilizar la base de Azure.
7. En VS Code, seleccionen Archivo → Abrir carpeta y elijan la carpeta principal que contiene README.md, public, backend y .vscode.
8. Si preguntan si confían en la carpeta, confirmen solo si es la copia que recibieron del equipo.
9. Abran Terminal → Nueva terminal y ejecuten npm install. Esperen a que termine sin errores.

## 10. Configurar la misma base: lo hace cada compañero

El responsable debe entregar cuatro datos: servidor completo, nombre de la base, usuario SQL de esa persona y su contraseña. Para Azure el puerto de conexión habitual es 1433.

1. Copien config/.env.example a la raíz del proyecto y nombren la copia .env. No debe quedar dentro de config ni llamarse .env.txt.
2. Completen la copia con sus datos, siguiendo este ejemplo:

```dotenv
DB_ENABLED=true
DB_SETUP_MODE=check
DB_SERVER=CAMBIAR_SERVIDOR.database.windows.net
DB_PORT=1433
DB_NAME=BD_VIAJES
DB_AUTH=sql
DB_USER=CAMBIAR_USUARIO
DB_PASSWORD="CAMBIAR_CONTRASENA"
DB_ODBC_DRIVER=ODBC Driver 18 for SQL Server
DB_TRUST_CERTIFICATE=false
```

3. DB_SERVER debe ser el mismo para todos. No pongan localhost ni SQLEXPRESS para la base compartida.
4. DB_USER y DB_PASSWORD son personales. DB_AUTH=sql indica que se usarán esas credenciales.
5. Dejen DB_SETUP_MODE=check: así los compañeros solo comprueban la base y no intentan crear tablas ni instalarla otra vez.
6. No agreguen PHP_APP_ORIGIN para este uso local con Live Server. La configuración actual comprueba la dirección desde la que abrieron el sitio.
7. Guarden .env. No lo suban a Git, no lo agreguen al ZIP y no envíen capturas donde se vea la contraseña.
8. Ejecuten CONFIGURAR-PHP.cmd. Prepara el controlador PHP y comprueba su conexión. En este modo no instala la base.
9. Ejecuten COMPROBAR-CONEXION.cmd. Debe aparecer LecturaYEscritura: OK. La comprobación crea datos temporales y los revierte.

Si la comprobación falla, no sigan como si estuviera guardando: revisen el nombre de servidor, la cuenta y la autorización de red.

## 11. Abrir con Live Server desde VS Code

1. Abran siempre la carpeta principal del proyecto.
2. Se incluyó una tarea para iniciar PHP al abrirla. Si VS Code pide permitir tareas automáticas, pueden permitirlas para este proyecto conocido.
3. Si no aparece la tarea o no quieren inicio automático, pulsen Ctrl+Shift+B. Se ejecutará Rumbo: iniciar PHP y comprobar SQL. También pueden ejecutar INICIAR-RUMBO.cmd.
4. Esperen el mensaje PHP y SQL Server disponibles. PHP debe seguir ejecutándose en segundo plano mientras usen la página.
5. Si Live Server ya estaba abierto, pulsen su botón Port: 5500 para detenerlo. Luego pulsen Go Live para arrancarlo con la nueva configuración.
6. Abran public/index.html con Open with Live Server o usen Go Live. La dirección debe ser http://127.0.0.1:5500/index.html o la raíz del mismo puerto. No debe incluir /public/ después del puerto: public ya es la carpeta de inicio configurada.
7. Regístrense o inicien sesión. Guarden un favorito o cambien su perfil.
8. Esperen Guardado en SQL Server. Al guardar un archivo de código pueden recargar con F5 si la vista no se actualiza automáticamente.

No cambien .vscode/settings.json para apuntar directamente a Azure. Live Server habla con PHP local en 8000; quien se conecta a Azure es PHP usando .env. Los archivos PHP por sí solos no funcionan si el proceso PHP está apagado.

## 12. Comprobar que de verdad trabajan juntos

1. Ambos compañeros comprueban que DB_SERVER y DB_NAME tienen exactamente los mismos valores.
2. La persona A abre la página con Live Server y registra una cuenta de prueba con un correo que puedan identificar.
3. La persona A guarda un perfil, carrito o favorito y espera el mensaje de guardado.
4. La persona B abre SSMS, conecta al servidor compartido con su cuenta SQL y escribe BD_VIAJES en las opciones de conexión.
5. La persona B abre database/CONSULTAR_DATOS.sql y pulsa F5. Debe poder encontrar la cuenta de prueba y las selecciones guardadas por A.
6. Si vuelven a guardar algo, la persona B vuelve a ejecutar la consulta con F5 para ver el cambio.

Las tablas comunes se comparten. Los perfiles, carritos y favoritos de la página están separados por usuario: B no verá el carrito privado de A simplemente por iniciar sesión con otra cuenta. Para recuperar sus propias elecciones en otra computadora, una persona inicia sesión con su misma cuenta de la web.

Los cambios en SQL no aparecen mágicamente en una pestaña que ya estaba abierta. Recarguen la página o vuelvan a ejecutar la consulta. No hay actualización automática en tiempo real entre todas las pantallas. Si dos pestañas editan la misma selección, el sitio avisa del conflicto antes de sobrescribirla.

## 13. Cómo compartir cambios de código y de tablas

Un cambio de dato y un cambio de archivo son cosas diferentes. Si cambian un dato en la base compartida, todos consultarán ese mismo dato. Si cambian un archivo PHP, HTML o JavaScript, deben compartirlo por Git para que los demás tengan el cambio.

Para agregar tablas o columnas:

1. Acuerden quién hará el cambio.
2. Creen un archivo nuevo en database/migrations con el siguiente número, por ejemplo 004_nueva_funcion.sql. No modifiquen migraciones ya aplicadas.
3. Prueben el cambio primero en una base de pruebas o copia separada.
4. El responsable revisa la copia de seguridad disponible antes de aplicar el cambio compartido.
5. Desde el proyecto actualizado ejecuten npm run db:export. Esto actualiza el instalador compartido.
6. Solo el responsable aplica INSTALAR_BASE_COMPARTIDA.sql en la base compartida. El instalador identifica las migraciones pendientes.
7. Compartan en Git tanto el cambio SQL como el código que lo utiliza. Los demás descargan los cambios y reinician PHP si es necesario.

No borren ni vuelvan a crear toda la base para compartir cambios. El instalador agrega el catálogo inicial que falte; no modifica automáticamente precios que ya existen. Los cambios a datos existentes se hacen mediante instrucciones de actualización revisadas.

## 14. Problemas frecuentes

- **Live Server muestra solo guardado local:** deténganlo y vuelvan a iniciarlo, abran la carpeta raíz y comprueben que .vscode/settings.json conserva el envío de todo el sitio a PHP.
- **No se abre la página / conexión rechazada:** ejecuten la tarea con Ctrl+Shift+B y revisen el error de la terminal. Live Server necesita que PHP esté encendido.
- **No encuentra una página:** utilicen /index.html, no /public/index.html en la dirección.
- **Login failed:** revisen usuario SQL, contraseña y DB_AUTH=sql. En SSMS seleccionen BD_VIAJES antes de conectar.
- **Azure bloquea la conexión:** el responsable debe permitir la dirección pública actual de esa persona.
- **Falta un controlador:** ejecuten CONFIGURAR-PHP.cmd y comprueben que PHP sea 8.2 TS x64 y ODBC sea 18 x64.
- **No tienen permiso para crear tablas:** es lo esperado para las cuentas del equipo. Dejen DB_SETUP_MODE=check. Solo el responsable instala cambios de estructura.
- **Hay que esperar demasiado al conectar:** comprueben si la base está reactivándose después de una pausa. No desactiven la comprobación del certificado para resolver una demora.
- **No aparecen cambios del compañero:** comprueben servidor y base, recarguen, y distingan los datos comunes de las elecciones privadas de cada cuenta.
- **Rumbito no responde con IA:** requiere su propia configuración. Esto es independiente del guardado SQL.

No borren los datos del navegador si hay cambios pendientes. Las selecciones antiguas guardadas solo en otro puerto o dirección no se trasladan automáticamente. Usen la misma dirección de Live Server de forma habitual y comprueben el guardado antes de cerrar.

## 15. Lista final antes de entregar

- Hay una base compartida real creada y accesible.
- Todos tienen el mismo servidor y BD_VIAJES en su .env.
- Cada persona tiene su propia cuenta SQL.
- Cada dirección de conexión está autorizada.
- CONFIGURAR-PHP y COMPROBAR-CONEXION terminan sin errores.
- PHP está iniciado y Live Server usa la configuración nueva.
- Una persona guarda y otra ve el resultado en SSMS.
- Las contraseñas no están en Git ni en el ZIP.
- El responsable sabe cómo recuperar una copia de seguridad del proveedor.

Las cuentas y el almacenamiento son reales. Los pagos y reservas del proyecto siguen siendo de demostración. Este manual prepara el trabajo en equipo; no publica una web para clientes. Para publicar la web se necesita además un alojamiento PHP adecuado y una dirección HTTPS.

## Referencias oficiales

- Crear Azure SQL: https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart
- Autorizar direcciones de conexión: https://learn.microsoft.com/en-us/azure/azure-sql/database/firewall-create-server-level-portal-quickstart
- Usuarios de la base: https://learn.microsoft.com/en-us/azure/azure-sql/database/logins-create-manage
- Controladores PHP: https://learn.microsoft.com/en-us/sql/connect/php/system-requirements-for-the-php-sql-driver
- Configuración de Live Server: https://github.com/ritwickdey/vscode-live-server/blob/master/docs/settings.md
