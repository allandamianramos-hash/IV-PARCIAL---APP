import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const manifest=JSON.parse(await readFile(new URL('catalogo-imagenes.json', new URL('../public/', import.meta.url)),'utf8'));
const context={window:{},document:{querySelector:()=>null}};
vm.runInNewContext(await readFile(new URL('tienda.js', new URL('../public/', import.meta.url)),'utf8'),context);
test('las cien fichas conservan sus identificadores y usan la asignación visual revisada',()=>{
 const products=context.window.RumboProducts;
 assert.equal(products.length,100);
 assert.equal(new Set(products.map(p=>p.id)).size,100);
 assert.equal(new Set(products.map(p=>p.image)).size,74);
 for(const entry of manifest){const p=products.find(p=>p.id===entry.id);assert.equal(p.name,entry.name);assert.equal(p.image,entry.image);assert.equal(p.imageKind,entry.kind);assert.doesNotMatch(p.imageAlt,/de la categoría/);}
});
test('todos los archivos del catálogo son imágenes JPEG válidas y locales',async()=>{
 for(const path of new Set(manifest.map(p=>p.image))){const bytes=await readFile(new URL(path, new URL('../public/', import.meta.url)));assert.equal(bytes[0],0xff,path);assert.equal(bytes[1],0xd8,path);assert.ok(bytes.length>1000,path);}
});
test('los productos que antes compartían fotos ajenas tienen imágenes diferentes',()=>{
 const p=id=>context.window.RumboProducts.find(p=>p.id===id);
 for(const [a,b] of [[31,2],[47,8],[50,8],[52,8],[63,13],[65,13],[75,20],[89,28],[94,28]])assert.notEqual(p(a).image,p(b).image);
 assert.equal(p(2).image,'imagenes/maleta.jpg');
 assert.ok(context.window.RumboVariantPreview.model(p(2),{Color:'Azul',Tamaño:'28 pulgadas'}));
});
