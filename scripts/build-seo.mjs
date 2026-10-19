import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../public/js/destinos/viajes.js',import.meta.url),'utf8'),context={window:{}};
vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),context);
const pages={
 'index.html':{title:'Rumbo | Destinos, viajes y experiencias',description:'Descubre destinos, organiza vuelos y hospedaje, explora experiencias y prepara tu próximo viaje con Rumbo. Planificación y pagos de demostración.'},
 'tienda.html':{title:'Tienda de viaje | Rumbo',description:'Explora accesorios, equipaje y productos para preparar tu viaje. Compara opciones y prueba una compra simulada, sin cargos reales.'},
 'viajes.html?pantalla=destinos':{title:'Destinos para tu próximo viaje | Rumbo',description:'Explora 100 destinos con información, fotografías, hospedaje y recorridos para inspirar tu próximo viaje.'},
 'viajes.html?pantalla=vuelos':{title:'Organiza tu vuelo | Rumbo',description:'Compara opciones de vuelo de demostración por destino, fecha y número de viajeros. Guarda tu selección en el resumen del viaje.'},
 'viajes.html?pantalla=hoteles':{title:'Hospedaje y hoteles por destino | Rumbo',description:'Explora propuestas de hospedaje y calcula tu estancia por habitaciones, noches y viajeros. Opciones de demostración.'},
 'servicios.html':{title:'Servicios de viaje | Rumbo',description:'Organiza vuelos, hospedaje, traslados, seguros y experiencias en un solo plan con Rumbo.'}
};
for(const [key,title,description] of [
 ['traslados','Transporte y traslados','Organiza el traslado entre el aeropuerto de tu destino y tu hospedaje. Compara propuestas según pasajeros y equipaje.'],
 ['seguros','Seguro de viaje','Compara propuestas de seguro según fechas, destino y viajeros. Las selecciones son de demostración y no contratan pólizas.'],
 ['guias','Experiencias y recorridos','Descubre recorridos, lugares y experiencias por destino para organizar tu viaje.'],
 ['privacidad','Política de privacidad','Consulta qué información utiliza Rumbo, cómo se conserva, qué proveedores intervienen y cómo ejercer control sobre tus datos.'],
 ['terminos','Términos y condiciones','Lee las condiciones de uso de Rumbo, sus cuentas y sus simulaciones de viajes, servicios y compras.'],
 ['cookies','Política de cookies','Conoce las cookies necesarias y la analítica opcional de Rumbo. Revisa cómo aceptar, rechazar o retirar tu permiso.'],
 ['cancelaciones','Cambios y cancelaciones','Consulta cómo modificar selecciones y qué implica cancelar una operación de demostración en Rumbo.'],
 ['legal','Información legal y licencias','Consulta las fuentes y licencias de fotografías y contenidos visuales utilizados en Rumbo.'],
 ['ayuda','Centro de ayuda','Encuentra respuestas para utilizar las cuentas, selecciones, compras simuladas y servicios de Rumbo.']
])pages['servicios.html?seccion='+key]={title:title+' | Rumbo',description};
for(const d of context.window.RumboViajesDatos.destinations)pages['viajes.html?pantalla=detalle-destino&destino='+d.id]={title:d.name+', '+d.country+' | Destinos Rumbo',description:(d.intro||d.description).slice(0,180),image:d.image,imageAlt:d.alt||d.name};
await writeFile(new URL('../config/seo-pages.json',import.meta.url),JSON.stringify(pages,null,2)+'\n');
console.log(`${Object.keys(pages).length} páginas públicas preparadas para metadatos y sitemap.`);
