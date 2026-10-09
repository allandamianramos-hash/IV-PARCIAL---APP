# Rumbo — PHP y SQL Server

**Conexión actual: Azure SQL.** Consulta [AZURE-CONEXION.md](docs/AZURE-CONEXION.md) para abrir la aplicación, conectar SSMS y verificar el guardado. El manual de Tailscale se conserva como referencia de la configuración anterior.

El sitio guarda cuentas, perfiles y selecciones mediante PHP/PDO_SQLSRV en `rumbo-2026.database.windows.net`, base `BD_VIAJES`, con autenticación SQL y conexión cifrada. Las credenciales están en el `.env` privado.

## Abrir el proyecto

**Omar: conserva tu carpeta actual de GitHub.** Descarga los cambios con Pull e instala el paquete privado `ACCESO-OMAR-GITHUB.zip` sobre esa misma carpeta. No uses el antiguo ZIP completo como otra copia de trabajo. Lee [los pasos para Omar y el trabajo compartido](docs/OMAR-EMPEZAR.txt). El instalador conserva Git y el código; `.env`, `.rumbo-equipo.json` y `.runtime` quedan excluidos del repositorio. Una vez instalado, `INICIAR-RUMBO.cmd` o Ctrl+Shift+B abre su aplicación en `http://127.0.0.1:3010`. Allan conserva su arranque PHP habitual en 8000.

1. Ejecuta **INICIAR-RUMBO.cmd**.
2. El lanzador abre **http://127.0.0.1:8000** en el navegador. Puedes cerrar la ventana del lanzador y Visual Studio Code.
3. Regístrate, guarda elecciones y vuelve a iniciar sesión para recuperarlas.

Para trabajar juntos con una base alojada, lee [el manual para el equipo](docs/MANUAL-PARA-EL-EQUIPO.html). También está disponible en [Markdown](docs/MANUAL-PARA-EL-EQUIPO.md). Incluye Azure SQL, usuarios individuales, configuración y pruebas entre compañeros.

**Visual Studio Code y Live Server son opcionales.** La dirección `http://127.0.0.1:8000` corresponde al servidor PHP independiente. El puerto `5500` pertenece a Live Server y deja de funcionar al cerrar el editor; úsalo solo para desarrollo. La tarea de VS Code también puede iniciar el servidor mediante Ctrl+Shift+B.

Ejecuta **ACTIVAR-RUMBO-AUTOMATICO.cmd** una vez para iniciar el proyecto al entrar a Windows y crear el acceso **Rumbo** en el escritorio. Este acceso prepara el servidor y abre la página directamente. El inicio automático usa la misma selección de PHP o Node portable que `INICIAR-RUMBO.cmd`; no requiere el editor. Para desactivarlo, elimina el acceso `Rumbo - servidor automatico` de `shell:startup`.

Si aparece guardado local, ejecuta **COMPROBAR-CONEXION.cmd**. Usa siempre el mismo hostname para conservar la sesión; `localhost` y `127.0.0.1` tienen cookies diferentes, y el almacenamiento local también depende del puerto. La computadora debe estar encendida y con la sesión de Windows iniciada; el acceso a Azure requiere Internet. Esto es ejecución local, no una publicación pública del sitio.

Consulta [Idiomas, organización y diagnóstico de Rumbito](docs/IDIOMAS-Y-ESTRUCTURA.md) para las nuevas carpetas, traducciones y pruebas de reseñas.

## Carpetas

- `public/`: HTML, CSS, JavaScript del navegador e imágenes.
- `backend/php/`: conexión PDO, cuentas, sesiones, catálogo, guardado e instalación.
- `backend/node/`: Rumbito y API Node compatible con las cuentas existentes.
- `database/`: instalador SQL, migraciones numeradas y herramientas de exportación.
- `scripts/`: preparación de PHP y arranque.
- `tests/`: pruebas; `tests/integration/` usa SQL Server real.
- `docs/`: instrucciones y documentación.
- `evidencias/`: capturas de comprobación.
- `.runtime/`: controlador y registros locales, excluidos de Git.

Los scripts del navegador están en `public/js/`, los estilos en `public/css/` y las imágenes están agrupadas por función. Las traducciones están en `public/locales/`.

La raíz conserva los accesos `.cmd`, los puntos de entrada `router.php` y `server.mjs`, configuración y dependencias. `.env` contiene la configuración privada y no se comparte. `rumbo-background.ps1` mantiene la compatibilidad con accesos automáticos anteriores.

## Funcionamiento

Se almacenan registro/login, perfil, favoritos, carrito, selección de vuelo/hotel, servicios, preparativos y resumen de compra de demostración. Hay 100 productos y 40 destinos; el catálogo combina los datos de SQL con las propuestas adicionales del sitio.

Si recibiste tu paquete personal del equipo, extraelo y abre `CONECTAR-EQUIPO.cmd`. Consulta [Acceso del equipo](docs/ACCESO-EQUIPO.md) para los requisitos y la autorización de la IP de tu casa. Para consultar las tablas en SSMS, abre `VER-BD-AZURE.cmd`.

PHP sirve el sitio en **8000**. Node conserva Rumbito en **3000**; el lanzador inicia ambos en segundo plano. `npm start` inicia la versión Node alternativa. El chat con IA necesita una clave propia en `.env`; sin ella se conserva el planificador local. `ACTIVAR-RUMBO-AUTOMATICO.cmd` activa el arranque del proyecto completo al iniciar sesión en Windows.

Las cuentas y el almacenamiento son reales. Los pagos, billetes y reservas siguen siendo de demostración. El servidor integrado de PHP es para desarrollo local.

## Validación y cambios

La portada de Inicio es una isla React con TypeScript y Tailwind CSS en `src/hero/`. Después de cambiarla, ejecuta `npm install` y `npm run build` con Node 22.12 o posterior. Vite genera `public/js/inicio/hero.js` y `public/css/inicio/hero.css` sin borrar los demás archivos públicos; comparte también estos dos archivos compilados para que PHP y los accesos habituales funcionen sin un servidor Vite. `npm run dev:hero` vuelve a compilar al guardar mientras navegas con el servidor habitual. La configuración de campañas de `public/index.html` y el catálogo compartido de `public/js/destinos/viajes.js` siguen siendo las fuentes de destinos y tarifas.

```powershell
npm test
npm run db:test
# Con INICIAR-RUMBO.cmd ejecutado:
npm run php:test
```

Las pruebas de integración crean y eliminan sus propios registros temporales. La prueba PHP comprueba login, persistencia, aislamiento, conflictos, hashes anteriores y bloqueo de archivos privados.

Los cambios de estructura se agregan en nuevas migraciones `database/migrations/004_...sql`. No edites migraciones aplicadas. Ejecuta `npm run db:export` para regenerar el instalador y `CONFIGURAR-PHP.cmd` para aplicarlo. Comparte el código y SQL juntos en Git. **PREPARAR-ENTREGA.cmd** genera un ZIP sin credenciales ni cuentas de usuarios.
