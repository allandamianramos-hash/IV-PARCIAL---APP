# Activación de cuentas

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

La migración `002_accounts.sql` añade usuarios y sesiones sin modificar el catálogo existente. Las contraseñas se guardan con scrypt y sal aleatoria. La cookie de sesión es HttpOnly, SameSite=Lax y dura 30 días; cerrar sesión revoca el token en el servidor. Configurar `APP_ORIGIN` con la URL HTTPS al publicar para que la cookie sea Secure.

Cada cuenta tiene sus propios datos de viaje. Las selecciones de un visitante anónimo no se transfieren automáticamente a una cuenta nueva. Al cambiar de cuenta se limpia la caché local y las otras pestañas se actualizan.

Pruebas locales: `node --test auth.test.mjs database.test.mjs project.test.mjs`. La prueba `database/auth.integration.test.mjs` requiere la conexión y las migraciones; crea y elimina solamente su cuenta de prueba.
