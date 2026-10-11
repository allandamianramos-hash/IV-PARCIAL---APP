# Activación de cuentas

El registro y acceso real con Google se explica en [GOOGLE-LOGIN.md](GOOGLE-LOGIN.md). Está integrado en PHP y Node y usa las mismas cuentas de SQL Server.

> La instalación PHP actual se explica en [SQL-SERVER-PHP.md](SQL-SERVER-PHP.md). Las instrucciones siguientes describen el servidor Node alternativo; ambos utilizan las mismas tablas de cuentas.

El registro y el inicio de sesión requieren una conexión real a SQL Server. Los archivos del repositorio no contienen la base ni sus credenciales. Sin conexión, los formularios muestran un error y no simulan guardar usuarios.

La persona que administra la base debe configurar el archivo privado `.env` a partir de `.env.example`: `DB_ENABLED=true`, servidor, nombre de base y método de autenticación. Para una base remota con usuario SQL, debe usar `DB_AUTH=sql`, `DB_USER` y `DB_PASSWORD`. No subir `.env` a Git ni enviar contraseñas por el chat.

Desde la carpeta del proyecto, ejecutar:

```sh
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:test
npm start
```

La migración `002_accounts.sql` añade usuarios y sesiones sin modificar el catálogo existente. Las contraseñas nuevas se guardan con bcrypt, coste 12 y sal aleatoria; las antiguas en scrypt siguen siendo verificables. La cookie de sesión es HttpOnly, SameSite=Lax y dura 8 horas; cerrar sesión revoca el token en el servidor. Configurar `APP_ORIGIN` con la URL HTTPS al publicar para que la cookie sea Secure.

Cada cuenta tiene sus propios datos de viaje. Las selecciones de un visitante anónimo no se transfieren automáticamente a una cuenta nueva. Al cambiar de cuenta se limpia la caché local y las otras pestañas se actualizan.

Pruebas locales: `node --test auth.test.mjs database.test.mjs project.test.mjs`. La prueba `database/auth.integration.test.mjs` requiere la conexión y las migraciones; crea y elimina solamente su cuenta de prueba.

Microsoft también crea cuentas y sesiones reales en PHP y Node. Consulta [MICROSOFT-LOGIN.md](MICROSOFT-LOGIN.md) para el registro de Entra, retornos locales y vinculación segura con la cuenta existente.

## Perfil y recomendaciones

El alias de «Mi perfil» se conserva en el estado de la cuenta y se utiliza completo en el saludo de «Mi cuenta». Guardar el perfil espera la confirmación del servidor; si falla la conexión, no muestra un guardado exitoso. El nombre original del registro se usa cuando no existe un alias.

Las reseñas usan el alias completo guardado de su autor, obtenido por el servidor desde su cuenta. También las reseñas anteriores muestran el alias actual; cuando no hay perfil se conserva el nombre de publicación. No se acepta un nombre o un propietario enviados con el comentario. Las páginas de acceso y registro no incluyen navbar ni asistente flotante; al completar cualquiera de los accesos se vuelve a `index.html`.

El estilo guardado (playa, naturaleza o cultura) prioriza los destinos coincidentes en «Recomendados» y en los seis destacados del inicio. El catálogo marca las coincidencias y permite cambiar el estilo desde el aviso. La búsqueda, los filtros y el orden explícito por precio o nombre se respetan; los demás destinos siguen disponibles. Eliminar el perfil retira esta personalización.

Prueba de extremo a extremo con PHP y SQL: `node --test tests/browser/profile-personalization.test.mjs`. Crea una cuenta temporal, comprueba guardado, nuevo inicio de sesión, recomendaciones, aislamiento y errores de conexión, y elimina su cuenta al finalizar.

La recuperación de contraseña está disponible desde acceso y registro. Consulta [RECUPERACION-CUENTA.md](RECUPERACION-CUENTA.md) para activar SMTP y aplicar la migración 007.


## Contraseña obligatoria en todos los accesos

Google y Microsoft verifican la identidad externa, pero el servidor no emite una sesión hasta verificar también la contraseña de Rumbo. Una cuenta nueva o una identidad ya vinculada sin contraseña debe crear y confirmar su clave. Una coincidencia de correos entre proveedores nunca basta para crear o cambiar la contraseña de otra cuenta.

Node y PHP comparten la lógica social en `backend/node/social-account.mjs`; PHP envía exclusivamente la identidad ya verificada por su verificador JWT, mediante stdin privado. No se emiten tokens temporales de acceso al navegador. El desafío de diez minutos se consume en SQL al completar el acceso, y se rechazan las repeticiones.

Hay un límite SQL de diez intentos de contraseña por correo en quince minutos compartido por acceso local y social y por ambos servidores; se suma al límite por IP. No cambia de límite al reiniciar Node. Las nuevas contraseñas admiten al menos ocho caracteres y como máximo 72 bytes, sin truncamiento de bcrypt.

Las sesiones duran como máximo ocho horas desde su creación. Cerrar sesión revoca su token y los desafíos sociales pendientes de ese navegador; recuperar la contraseña revoca todas las sesiones de la cuenta. La emisión de una sesión comprueba que el hash no haya cambiado desde la verificación, evitando abrir una sesión con la clave anterior si se restablece al mismo tiempo.

No se guardan contraseñas ni los ID tokens sociales en localStorage. Microsoft borra su caché al recibir el resultado. El formulario existente recibe el correo que devuelve el servidor después de verificar la identidad y el desafío, y solicita allí la contraseña de Rumbo sin abrir diálogos. El correo queda bloqueado hasta elegir «Usar otra cuenta». Las cuentas nuevas crean y confirman su contraseña en ese mismo formulario; las existentes conservan el enlace de recuperación. Los campos de contraseña se vacían al cambiar de cuenta, salir o fallar la verificación. Las credenciales nuevas deben introducirse en el navegador por su titular.

Pruebas: `npm test`, `node --test tests/integration/auth.test.mjs tests/integration/php.test.mjs tests/integration/google-auth.test.mjs tests/integration/microsoft-auth.test.mjs tests/integration/password-recovery.test.mjs`, `node --test tests/browser/social-password.test.mjs`. Las pruebas de interfaz simulan la respuesta del proveedor; las de firmas criptográficas y SQL comprueban de forma separada la identidad y la obligatoriedad de la contraseña. La configuración de dominio HTTPS y revisión de publicación OAuth sigue siendo necesaria antes de publicar.


## Dependencias revisadas el 10 de octubre de 2026

Se actualizó `tedious` de 20.0.0 a 20.3.3, la última versión que devuelve el registro configurado. `npm audit --omit=dev` aún informa dos avisos moderados, ambos del uso transitivo de `sprintf-js` (GHSA-hp3w-g68c-fv3c), sin avisos altos o críticos de ejecución. La ficha oficial no publica una versión corregida de `sprintf-js`; no se declara resuelto este aviso. El controlador usa formatos constantes en los puntos examinados, no formatos aportados por formularios de Rumbo; esto reduce la exposición observada, pero no equivale a una garantía general.

La auditoría incluyendo desarrollo informa además siete avisos (cinco altos y dos moderados) en el árbol de Tailwind 3: análisis de selectores y patrones de archivos. Estas herramientas compilan el proyecto y no procesan entradas de usuarios en las rutas de cuentas. La solución sugerida por npm migra a Tailwind 4; esa migración puede afectar el diseño y requiere una revisión aparte. No se aplicó `audit fix --force` ni se ocultaron avisos.

Referencia: https://github.com/advisories/GHSA-hp3w-g68c-fv3c
