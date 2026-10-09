import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {applyStoreCatalog} from '../backend/node/store-catalog.mjs';
const root=new URL('../public/',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('catalogo-imagenes.json',root),'utf8'));
const catalog=JSON.parse(await readFile(new URL('../config/store-catalog.json',import.meta.url),'utf8'));
const script=await readFile(new URL('js/tienda/tienda.js',root),'utf8');
const context={window:{},document:{querySelector:()=>null}};
vm.runInNewContext(script,context);
const products=context.window.RumboProducts;

test('cien productos distintos, con cien imágenes únicas y snapshots sincronizados',()=>{
 assert.deepEqual(JSON.parse(JSON.stringify(products)),catalog.products);
 assert.equal(products.length,100);
 for(const key of ['id','name','image'])assert.equal(new Set(products.map(p=>p[key])).size,100,key);
 assert.equal(manifest.length,100);
 for(const entry of manifest){const p=products.find(p=>p.id===entry.id);assert.equal(p.name,entry.name);assert.equal(p.image,entry.image);assert.equal(p.imageKind,entry.kind);assert.doesNotMatch(p.imageAlt,/de la categoría/);}
});
test('fotos locales JPEG o PNG válidas, sin copias del mismo archivo con otro nombre',async()=>{
 const hashes=new Set();
 for(const path of products.map(p=>p.image)){
  const bytes=await readFile(new URL(path,root));
  const jpeg=bytes[0]===255&&bytes[1]===216,png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  assert.ok(jpeg||png,path);assert.ok(bytes.length>1000,path);
  const hash=createHash('sha256').update(bytes).digest('hex');assert.ok(!hashes.has(hash),'imagen duplicada: '+path);hashes.add(hash);
 }
});
test('SQL conserva los precios sin restaurar productos, fotos u opciones retiradas',()=>{
 const obsolete={products:catalog.products.map(p=>({id:p.id,name:'Viejo',image:'repetida.jpg',price:123})),productOptions:{28:{Color:['Verde']}},priceAdjustments:{28:{Color:{Verde:900}}}};
 const updated=applyStoreCatalog(obsolete);
 assert.equal(updated.products[27].name,'Kit de higiene personal');
 assert.equal(updated.products[27].price,123);
 assert.deepEqual(updated.productOptions,catalog.productOptions);
 assert.deepEqual(updated.priceAdjustments[28],{});
 const connected={window:{RumboDatabase:{connected:true,catalog:obsolete}},document:{querySelector:()=>null}};
 vm.runInNewContext(script,connected);
 for(const p of connected.window.RumboProducts){assert.equal(p.price,123);assert.equal(p.image,catalog.products.find(x=>x.id===p.id).image);}
});
test('los dos servidores permiten cargar el renderizador de variantes',async()=>{
 for(const file of ['server.mjs','router.php']){
  const source=await readFile(new URL('../'+file,import.meta.url),'utf8');
  assert.ok(source.includes("'js/tienda/variant-preview.js'"),file);
 }
});
