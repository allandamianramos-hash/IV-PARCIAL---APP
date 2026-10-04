# Acceso de cada compañero

Allan entrega a cada persona solamente su ZIP `RUMBO-EQUIPO-nombre.zip`.
Cada paquete contiene el proyecto y una contraseña diferente; no lo subas
a GitHub ni lo compartas con otra persona.

## Primera vez

Requisitos: Windows, Node.js 22 o posterior, XAMPP con PHP 8.2 x64 Thread Safe
y Microsoft ODBC Driver 18 x64. Son los mismos requisitos del proyecto original.
El acceso a la IP pública de tu casa debe estar autorizado en el servidor Azure.

Descomprime el paquete en una carpeta y haz doble clic en **CONECTAR-EQUIPO.cmd**.
El acceso configura `.env`, instala las dependencias del proyecto que falten,
comprueba Azure, prepara el controlador PHP y abre la aplicación.
No necesitas copiar contraseñas, ejecutar SQL de instalación ni crear otra base.
En los siguientes usos basta con **INICIAR-RUMBO.cmd**.

Si Azure bloquea tu IP, envía a Allan únicamente la dirección IPv4 indicada en
el mensaje. Él debe autorizarla en Azure → rumbo-2026 → Redes. Repite después
el mismo acceso. Si cambia la IP de tu conexión doméstica, se repite este paso.
Una IP pendiente de autorizar no significa que el paquete esté mal configurado.

## Ver los datos

Abre **VER-BD-AZURE.cmd**. Abre SSMS con el servidor, base y usuario preparados.
Si solicita una contraseña, utiliza `DB_PASSWORD` de tu `.env`. Pulsa F5 para
ejecutar el archivo abierto: muestra tablas, columnas, catálogo, cuentas y
selecciones, sin mostrar hashes de contraseñas ni de sesiones.

En el Explorador de objetos de SSMS, expande **Bases de datos → BD_VIAJES → Tablas**.
Todas las cuentas personales del equipo trabajan sobre la misma base de Azure.
Tienen permisos para trabajar con datos, incluidos los de las cuentas del sitio,
pero no para crear o borrar tablas ni modificar la estructura de la base.

La conexión usa cifrado y valida el certificado. El paquete no incluye la
contraseña del administrador, claves de IA, respaldos ni cuentas de otros compañeros.
