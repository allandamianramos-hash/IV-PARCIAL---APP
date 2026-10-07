# Idiomas y organización

El selector aplica el idioma a todas las páginas: inicio y hero React, destinos,
vuelos, hoteles, servicios, guías, tienda, carrito, resumen, registro, cuenta y
páginas de error. También actualiza contenido insertado después de filtrar,
abrir un diálogo o recibir una respuesta del servidor. Se conservan los valores
de los formularios; se traducen etiquetas y opciones, nunca sus identificadores.
Los nombres de usuarios, correos, mensajes escritos por el usuario y reseñas
se mantienen en su idioma original.

## Dónde editar

- `public/js/`: `inicio`, `destinos`, `servicios`, `tienda`, `cuenta`, `comunidad`,
  `rumbito`, `idiomas` y `compartido`.
- `public/css/`: estilos separados por esas mismas funciones.
- `public/imagenes/`: productos y mascota de Rumbito.
- `public/imagenes-viajes/`: destinos, hoteles, guías, portadas, cuenta y servicios.
- `public/locales/`: catálogo de mensajes en español y los nueve idiomas de destino.
- `src/hero/`: componentes React originales; `npm run build` actualiza los
  archivos compilados dentro de `public/js/inicio` y `public/css/inicio`.
- `config/asset-aliases.json`: compatibilidad con rutas de imágenes ya guardadas
  en SQL. No duplica imágenes ni expone archivos privados.
- `evidencias/idiomas/`: capturas actuales de comprobación.
- `.runtime/`: registros, informes y herramientas temporales; no se publica.

Los accesos `.cmd` y los dos servidores permanecen en la raíz. Los instaladores
SQL y migraciones aplicadas conservan sus rutas históricas y funcionan mediante
el mapa de compatibilidad. No es necesario modificar datos ni cuentas existentes.

## Mantener traducciones

`public/js/idiomas/translations.js` conserva traducciones revisadas de navegación,
hero y comunidad; tienen prioridad sobre los catálogos JSON. El resto del
catálogo se generó localmente con [Argos Translate](https://github.com/argosopentech/argos-translate)
y [CTranslate2](https://github.com/OpenNMT/CTranslate2), con una traducción
intermedia al inglés para los demás idiomas. Es traducción automática y admite
correcciones editoriales. El navegador no necesita modelos, una clave de IA ni
un servicio de traducción externo.

El generador elimina las marcas de separación de SentencePiece antes de guardar
los textos. Las pruebas verifican los nueve idiomas de destino, incluidos los
catálogos y sus correcciones prioritarias, para impedir que aparezcan barras
bajas del traductor. Los guiones bajos legítimos en créditos se conservan.

Los modelos proceden del [índice oficial de Argos](https://github.com/argosopentech/argospm-index).
Los modelos OPUS-MT acreditan a Jörg Tiedemann y Santhosh Thottingal y especifican
CC BY 4.0. Los créditos particulares se conservan en la documentación distribuida
con cada modelo durante la generación. Los modelos no forman parte de la web.

Para actualizar textos, ejecutar `npm run i18n:extract`. La extracción lee código
público y mensajes de validación; `scripts/i18n/catalog-texts.json` incluye los
textos del catálogo público existente en SQL, sin cuentas ni sesiones. Actualizar
este archivo cuando se modifique ese contenido. Después completar los nuevos
mensajes en cada JSON o usar el generador de desarrollo:

```powershell
python -m venv .runtime/localization
.runtime/localization/Scripts/python -m pip install -r scripts/i18n/requirements.txt
.runtime/localization/Scripts/python scripts/i18n/generate.py
```

El generador descarga modelos y guarda archivos temporales en `.runtime`.
Las claves `{0}`, `{destination}`, etc. deben conservarse. `npm test` detecta
mensajes ausentes y cambios en esos parámetros.

## Comprobaciones

```powershell
npm run build
npm test
npm run test:reviews
npm run test:browser
npm run chat:check
```

Las pruebas de reseñas necesitan PHP en 8000 y la base configurada; crean cuentas
temporales y limpian únicamente sus registros. Comprueban invitados, origen
ajeno y suplantación del identificador en ambos servidores. Las pruebas de
navegador usan Edge; `BROWSER_CHANNEL` permite seleccionar otro navegador
compatible con Playwright. `BROWSER_TEST_ORIGIN` cambia la URL del sitio.

## Rumbito

El diagnóstico del 7 de octubre de 2026 confirmó la conexión real con Lightning
después de actualizar `LIGHTNING_API_KEY` en `.env`.
La clave permanece privada; no se
incluye en HTML, catálogos ni registros. El servidor relee la configuración de
Rumbito en cada petición, por lo que basta guardar el archivo y volver a probar.
`npm run chat:check` realiza una consulta breve al proveedor y distingue una
respuesta de IA de la respuesta local de respaldo.
