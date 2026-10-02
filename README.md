# Rumbo — PHP y SQL Server

**Conexión gratuita del equipo:** usa [MANUAL-GRATIS-MISMA-BASE.html](docs/MANUAL-GRATIS-MISMA-BASE.html). Explica cómo conectar a todos a la base de Jimmy mediante Tailscale, sin contratar alojamiento. Incluye los pasos de Jimmy, los de sus compañeros y la comprobación final. La computadora de Jimmy debe permanecer encendida. El manual de Azure se conserva únicamente como alternativa.

El sitio guarda cuentas, perfiles y selecciones en SQL Server mediante PHP/PDO_SQLSRV. En esta computadora utiliza `localhost`, `BD_VIAJES` y autenticación de Windows.

## Abrir el proyecto

1. Ejecuta **INICIAR-RUMBO.cmd**.
2. Abre **http://localhost:8000**.
3. Regístrate, guarda elecciones y vuelve a iniciar sesión para recuperarlas.

Para trabajar juntos con una base alojada, lee [el manual para el equipo](docs/MANUAL-PARA-EL-EQUIPO.html). También está disponible en [Markdown](docs/MANUAL-PARA-EL-EQUIPO.md). Incluye Azure SQL, usuarios individuales, configuración y pruebas entre compañeros.

**Live Server ya está configurado para pasar todo el sitio a PHP.** Abre esta carpeta principal en VS Code, inicia PHP con Ctrl+Shift+B y reinicia Go Live. Usa http://127.0.0.1:5500/index.html. La tarea puede arrancar al abrir la carpeta si autorizas las tareas automáticas de este proyecto. Los archivos PHP necesitan PHP y un servidor SQL funcionando; compartir esos archivos no comparte los datos.

Si aparece guardado local, ejecuta **COMPROBAR-CONEXION.cmd**. Para trabajar sin Live Server, usa **INICIAR-RUMBO.cmd** y http://localhost:8000. La configuración local de Jimmy permanece local hasta que se cree la base alojada y se cambie su .env.

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

La raíz conserva los accesos `.cmd`, los puntos de entrada `router.php` y `server.mjs`, configuración y dependencias. `.env` contiene la configuración privada y no se comparte. `rumbo-background.ps1` mantiene la compatibilidad con accesos automáticos anteriores.

## Funcionamiento

Se almacenan registro/login, perfil, favoritos, carrito, selección de vuelo/hotel, servicios, preparativos y resumen de compra de demostración. Hay 100 productos, 14 destinos y 70 hoteles.

PHP sirve el sitio en **8000**. Node conserva Rumbito en **3000**; el lanzador inicia ambos. `npm start` inicia la versión Node alternativa. El chat con IA necesita una clave propia en `.env`; sin ella se conserva el planificador local. `ACTIVAR-RUMBO-AUTOMATICO.cmd` mantiene el arranque anterior de Node; para entrar al sitio PHP utiliza `INICIAR-RUMBO.cmd`.

Las cuentas y el almacenamiento son reales. Los pagos, billetes y reservas siguen siendo de demostración. El servidor integrado de PHP es para desarrollo local.

## Validación y cambios

```powershell
npm test
npm run db:test
# Con INICIAR-RUMBO.cmd ejecutado:
npm run php:test
```

Las pruebas de integración crean y eliminan sus propios registros temporales. La prueba PHP comprueba login, persistencia, aislamiento, conflictos, hashes anteriores y bloqueo de archivos privados.

Los cambios de estructura se agregan en nuevas migraciones `database/migrations/004_...sql`. No edites migraciones aplicadas. Ejecuta `npm run db:export` para regenerar el instalador y `CONFIGURAR-PHP.cmd` para aplicarlo. Comparte el código y SQL juntos en Git. **PREPARAR-ENTREGA.cmd** genera un ZIP sin credenciales ni cuentas de usuarios.
