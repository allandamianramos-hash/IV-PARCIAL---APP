# Recuperación de cuenta

`recuperar-contrasena.html` permite pedir un código por correo, verificarlo y guardar una nueva contraseña. Los usuarios con cuentas exclusivamente de Google o Microsoft deben entrar con su proveedor.

## Activar correo

1. Aplicar `database/migrations/007_password_recovery.sql` con `npm run db:migrate` usando una cuenta administradora de la base. La aplicación solo necesita los permisos del rol `RumboEquipo`.
2. Completar las variables `MAIL_*` de `.env`, tomando `.env.example` como referencia. Nunca subir `.env` al repositorio ni poner credenciales en JavaScript público.
3. Para Gmail, usar `smtp.gmail.com`, puerto `465`, `MAIL_SMTP_SECURE=true` y la misma dirección en `MAIL_SMTP_USER` y `MAIL_FROM`. Activar la verificación en dos pasos y crear una contraseña de aplicación llamada «Rumbo» en https://myaccount.google.com/apppasswords. Introducirla **solo** en `MAIL_SMTP_PASSWORD`; no usar la contraseña normal de la cuenta.
4. Generar `MAIL_RESET_SECRET` aleatorio de al menos 32 caracteres (comando en `.env.example`). Conservarlo entre reinicios. Si se cambia, los códigos pendientes dejarán de funcionar.
5. Reiniciar Node después de cambiar `.env`. PHP lee la configuración al procesar cada solicitud mediante el puente Node; necesita Node en PATH o `NODE_BIN` configurado.
6. En producción, configurar el origen HTTPS exacto y probar la llegada del correo a una cuenta de prueba, incluida la carpeta de spam. Los límites de envío dependen del proveedor SMTP.

La pantalla informa que el servicio no está disponible cuando falta la configuración. Un resultado HTTP 200 en la solicitud no garantiza la entrega: por privacidad se usa el mismo mensaje para una cuenta inexistente, una cuenta social y una entrega fallida. Los fallos de envío generan `MAIL_DELIVERY_FAILED` en el servidor, sin registrar códigos ni contraseñas. No hay códigos de demostración ni un método alternativo para saltar la verificación.

## Controles

- Códigos aleatorios de seis dígitos, válidos durante diez minutos, almacenados con HMAC.
- Cinco intentos por código. Un minuto entre solicitudes y tres solicitudes por correo cada quince minutos, con límite adicional por IP.
- Ventana uniforme de respuesta de 18 segundos para solicitudes con SMTP configurado, para reducir diferencias de tiempo entre cuentas. El envío SMTP tiene un límite global de 12 segundos.
- Después de verificar, autorización aleatoria de un solo uso válida durante cinco minutos. El navegador la conserva solo en memoria; SQL guarda únicamente su hash.
- Al cambiar la contraseña se invalidan todos los códigos y todas las sesiones de la cuenta. Hay que iniciar sesión de nuevo.
- Validación del origen, consultas parametrizadas y bcrypt para la contraseña nueva. Las cuentas vinculadas conservan sus proveedores de acceso.

## Pruebas

`node --test tests/integration/password-recovery.test.mjs` verifica el servicio real con SQL y correo capturado en memoria, sin enviar mensajes. Crea una cuenta temporal y la elimina al terminar. Comprueba intentos, caducidad del código y la autorización, reutilización, límites, cuentas inexistentes/sociales, fallo SMTP y revocación de sesiones.

`node --test tests/browser/recovery-design.test.mjs` verifica los pasos del formulario con respuestas controladas, los botones sociales y el catálogo en escritorio y móvil. La entrega real por Gmail requiere la contraseña de aplicación y una prueba aparte.
