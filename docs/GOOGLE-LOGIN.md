# Acceso con Google en Rumbo

Configuración compartida actualizada el 12 de octubre de 2026: proyecto Google Cloud `viajes-rumbo`, cliente OAuth web **Rumbo Web Local**. El ID público está incluido en `config/oauth-public.json`, que se comparte en Git y en el ZIP de entrega. PHP y Node lo cargan automáticamente: ni los usuarios ni los compañeros necesitan pedir IDs, secretos o un `.env` ajeno para el acceso con Google. Este flujo usa Google Identity Services y no necesita el secreto del cliente ni una API key.

Los compañeros con la conexión a la base ya instalada solo deben descargar los cambios y volver a abrir `INICIAR-RUMBO.cmd`. Si `GOOGLE_CLIENT_ID` no existe o está vacío en su `.env`, se usa la configuración compartida. Un valor no vacío permite al responsable usar otra aplicación OAuth; un valor inválido deshabilita el proveedor y debe corregirse o quitarse. La conexión privada a SQL Server sigue siendo independiente de OAuth.

## Uso

1. Abre `INICIAR-RUMBO.cmd` y usa la dirección que abre el lanzador: PHP en `http://127.0.0.1:8000` o la copia portable en `http://127.0.0.1:3010`.
2. En **Registrarse** o **Iniciar sesión**, pulsa **Continuar con Google** y elige tu cuenta.
3. Tras verificar Google, Rumbo pide su contraseña propia en cada nuevo acceso. Una cuenta nueva o una cuenta antigua de Google sin contraseña debe crearla y confirmarla antes de iniciar sesión. Una cuenta existente con contraseña la confirma para vincular Google conservando sus datos.
4. **Mi cuenta → Cerrar sesión** revoca la sesión de Rumbo. No cierra tu cuenta de Google.

Usa siempre el mismo host: `localhost` y `127.0.0.1` tienen cookies separadas. La sesión dura 8 horas. Google y Microsoft requieren además la contraseña propia de Rumbo.

## Google Cloud

En **Google Auth Platform → Clientes → Rumbo Web Local**, están autorizados estos orígenes JavaScript:

- `http://localhost`
- `http://localhost:8000`
- `http://localhost:3000`
- `http://127.0.0.1:8000`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3010`
- `http://localhost:3010`

Los orígenes del puerto 3010 se añadieron el 12 de octubre de 2026. Google avisa que los cambios pueden tardar entre 5 minutos y algunas horas en aplicarse.

No hay URI de redireccionamiento: el botón utiliza una ventana emergente y devuelve la credencial al callback JavaScript. El navegador la envía por POST al backend del mismo origen. No se debe añadir `/registro.html` ni `/iniciar-sesion.html` a los orígenes.

La aplicación permanece en estado **Prueba** para desarrollo local. Solo solicita `openid`, `email` y `profile`. Google documenta una excepción a las restricciones de usuarios de prueba para el acceso que solicita únicamente identidad básica; no se agregan permisos de Gmail, Drive ni Calendar. Si se amplían los permisos en el futuro, hay que revisar nuevamente público, usuarios de prueba y verificación.

Al publicar: añadir el dominio HTTPS exacto, completar página principal y enlaces públicos de privacidad/términos, revisar el estado de publicación y los requisitos de verificación, configurar `PHP_APP_ORIGIN` para PHP o `APP_ORIGIN` para Node y reiniciar Node. Estos pasos de producción no están hechos porque todavía no hay dominio público.

## Backend y base de datos

Ambos servidores validan la firma, audiencia, emisor y vencimiento con `google-auth-library`. PHP ejecuta `backend/php/verify-google.mjs` con la credencial por stdin; por eso necesita Node y `npm install`. No usa tokens en argumentos de procesos, URL ni logs. `NODE_BIN` puede indicar la ruta absoluta de Node si PHP no lo encuentra.

El servidor comprueba origen, exige JSON, limita intentos y vincula cada respuesta con un nonce HttpOnly que expira a los 10 minutos y se consume en SQL. Las cuentas se identifican por `GoogleSubject`, no solamente por correo. La vinculación con una cuenta existente exige su contraseña de Rumbo. Las cuentas creadas con Google tienen una contraseña de Rumbo protegida con bcrypt (coste 12). Las cuentas antiguas sin contraseña la crean después de demostrar su identidad con el GoogleSubject ya vinculado. No se permite crear una contraseña basándose solamente en la coincidencia de correos.

Las migraciones `004_google_accounts.sql` y `005_google_permissions.sql` añaden la identidad de Google, desafíos temporales y permisos mínimos para el rol de aplicación. Ya se aplicaron a la base compartida. Para otra instalación, el administrador debe aplicar las nuevas migraciones con `npm run db:migrate` o el instalador SQL actualizado. El usuario limitado de aplicación no puede cambiar la estructura; la configuración cotidiana debe seguir usando ese usuario limitado.

## Comprobación

```powershell
npm test
npm run db:test
npm run php:test
node --test tests/integration/google-auth.test.mjs
node --test tests/integration/oauth-config.test.mjs
```

Las pruebas de Google verifican firma RSA, audiencia, emisor, vencimiento, correo verificado, nonce, registro, acceso posterior, vinculación con contraseña y rechazo de repetición. Las pruebas SQL crean y limpian únicamente sus registros temporales.

Comprobación del 12 de octubre de 2026: pasaron 141 pruebas unitarias y la integración `oauth-config.test.mjs` contra SQL. Se verificaron IDs compartidos en PHP y Node sin configuración OAuth privada y botones habilitados en el puerto 3010. Google Cloud confirmó el guardado de los nuevos orígenes; inmediatamente después Google todavía rechazaba ese origen durante la propagación. No se completó un acceso real con Google en 3010 durante esta comprobación.

Si el nonce vence, recarga la página. Si aparece `origin_mismatch`, revisa el host y el puerto exactos y espera la propagación de los cambios de Google. Si el botón no carga, comprueba la conexión y bloqueadores del navegador. Un error de base de datos no se transforma en un inicio de sesión simulado.

Referencias oficiales: [configuración de Google Identity Services](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid), [validación de identidad en el servidor](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [estado de publicación y excepción de identidad básica](https://support.google.com/cloud/answer/15549945).
