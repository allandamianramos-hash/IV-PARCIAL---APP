# Acceso con Microsoft en Rumbo

Aplicación registrada: **Rumbo Web**, id. público `fe9b2972-433b-4cc1-9e0e-f173f742c727`.
Audiencia: cuentas personales de Microsoft y cuentas de cualquier organización de Entra ID.

## Configuración local

El `.env` privado contiene `MICROSOFT_CLIENT_ID`. No se necesita secreto de cliente para esta integración SPA.
La biblioteca oficial `@azure/msal-browser` usa código de autorización con PKCE, `state` y `nonce`.
El servidor verifica el ID token con `jose`: firma RSA, audiencia, emisor e inquilino, emisor de la clave, vencimiento y desafío de un solo uso.

Estas direcciones de retorno están registradas como **SPA**, con concesión implícita desactivada:

- `http://localhost:8000/microsoft-callback.html`
- `http://127.0.0.1:8000/microsoft-callback.html`
- `http://127.0.0.1:3000/microsoft-callback.html`
- `http://127.0.0.1:3010/microsoft-callback.html`

Microsoft omite el puerto al comparar retornos `localhost`; los retornos `127.0.0.1` se registraron explícitamente mediante el manifiesto de Microsoft Graph (`spa.redirectUris`).
Se retiró el permiso predeterminado `User.Read`: Rumbo no consulta Microsoft Graph, correo ni archivos. Solicita `openid`, `profile` y `email`; MSAL incorpora `offline_access`. Los tokens de Microsoft se borran de la caché tras crear la sesión de Rumbo y no se almacenan en SQL.

## Funcionamiento

Los botones de registro e inicio usan el mismo flujo. Las identidades nuevas crean una cuenta; las conocidas recuperan su cuenta por el identificador inmutable `tid:oid`, aunque cambie el correo.
La sesión propia usa cookie HttpOnly, SameSite=Lax y duración de 8 horas.

Si ya existe el correo, **no se vincula automáticamente**: el usuario debe confirmar su contraseña de Rumbo. Si todavía no tiene una, debe entrar primero con el proveedor ya vinculado y crearla. No basta con que dos proveedores declaren el mismo correo.
La contraseña de Rumbo es obligatoria en cada acceso, incluso con una identidad ya vinculada. Las cuentas nuevas la crean y confirman antes de abrir sesión. El desafío se consume únicamente cuando identidad y contraseña han sido verificadas. Microsoft recibe `prompt: login` para solicitar también una nueva autenticación en el proveedor.
Si Microsoft no proporciona un correo utilizable para una cuenta nueva, se explica que debe usar otra cuenta o el registro por correo.

La migración `006_microsoft_accounts.sql` agrega `MicrosoftSubject` y `RumboMicrosoftChallenges`. Ya está aplicada en la base compartida. En otra instalación debe aplicarla el administrador; la aplicación conserva su usuario SQL limitado.

## Compilación y pruebas

```powershell
npm install
npm run build:auth
npm test
node --test tests/integration/microsoft-auth.test.mjs
```

`src/auth/microsoft.js` genera `public/js/cuenta/microsoft-sdk.js`. Compartir el archivo compilado junto con el código para que funcionen PHP y Node sin Vite en ejecución.
PHP necesita Node para `backend/php/verify-microsoft.mjs`; `NODE_BIN` permite indicar su ruta. Los tokens se pasan por stdin, nunca por argumentos de procesos.

Verificación local realizada el 10 de octubre de 2026: consentimiento y acceso real con una cuenta personal de Microsoft, vinculación al perfil existente mediante Google y nuevo acceso únicamente con Microsoft después de cerrar sesión. No se creó un perfil duplicado. Pasaron las 135 pruebas unitarias y las pruebas de integración con SQL y PHP. Los botones se revisaron en escritorio y en anchos móviles de 390 y 320 píxeles, sin desbordamiento horizontal.

## Publicación y limitaciones

Esta configuración corresponde a servidores locales, no publica el sitio. Al definir el dominio de producción, agregar `https://DOMINIO/microsoft-callback.html` a la plataforma SPA y configurar `PHP_APP_ORIGIN` o `APP_ORIGIN` con ese origen HTTPS para proteger la cookie.
Configurar también los orígenes de Google y los enlaces públicos de privacidad/términos en los portales correspondientes.

Microsoft muestra el editor como «sin comprobar» mientras no se verifique. Algunas organizaciones exigen consentimiento de su administrador o editor verificado. Rumbo no puede omitir esas políticas. Las cuentas personales pueden consentir el acceso básico, como se comprobó en la prueba local.

Referencias: [flujo de autorización con PKCE](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow), [restricciones de retorno](https://learn.microsoft.com/en-us/entra/identity-platform/reply-url), [claims de identidad](https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference).
