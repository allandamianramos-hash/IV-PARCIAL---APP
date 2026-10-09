// Keep the buildless browser snapshot usable offline, and the server snapshot identical.
import {readFile,writeFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile(new URL('../config/store-catalog.json',import.meta.url),'utf8'));
const path=new URL('../public/js/tienda/tienda.js',import.meta.url);
const source=await readFile(path,'utf8');
const header='// Catálogo revisado. Snapshot compartido: config/store-catalog.json.\n'+
  'const CATALOG_REVISION = '+JSON.stringify(catalog.revision)+';\n'+
  'const RETIRED_PRODUCT_IDS = '+JSON.stringify(catalog.retired)+';\n'+
  'const PRODUCTS = '+JSON.stringify(catalog.products,null,2)+';\n'+
  'const PRODUCT_OPTIONS = '+JSON.stringify(catalog.productOptions,null,2)+';\n'+
  'const OPTION_PRICE_ADJUSTMENTS = '+JSON.stringify(catalog.priceAdjustments,null,2)+';\n\n';
await writeFile(path,header+source.slice(source.indexOf('const PHOTO_CREDITS')));
await writeFile(new URL('../public/catalogo-imagenes.json',import.meta.url),JSON.stringify(catalog.products.map(p=>({id:p.id,name:p.name,image:p.image,kind:p.imageKind,referenceProduct:p.id,referenceName:p.name})),null,2)+'\n');
