import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
const context={window:{},document:{querySelector:()=>null}};
vm.runInNewContext(await readFile(new URL('tienda.js', new URL('../public/', import.meta.url)),'utf8'),context);
const preview=context.window.RumboVariantPreview;
const product=context.window.RumboProducts.find(p=>p.id===2);
test('las doce variantes conservan el mismo modelo y escalan sin deformarlo',async()=>{
 const images=new Set(),markup=new Set();
 for(const Color of ['Negro','Azul','Rojo','Verde'])for(const Tamaño of ['20 pulgadas','24 pulgadas','28 pulgadas']){
  const v=preview.model(product,{Color,Tamaño});images.add(v.image);markup.add(preview.markup(product,{Color,Tamaño}).replace(/variant-color-\d+/g,'filter'));
  assert.equal(v.color,Color);assert.equal(v.size,Tamaño);assert.ok(v.scale>0&&v.scale<=1);
  await access(new URL(v.image, new URL('../public/', import.meta.url)));
 }
 assert.equal(images.size,1);assert.equal(markup.size,12);
});
test('el tamaño crece progresivamente y los filtros de cada miniatura son únicos',()=>{
 const sizes=['20 pulgadas','24 pulgadas','28 pulgadas'].map(Tamaño=>preview.model(product,{Tamaño}).scale);
 assert.ok(sizes[0]<sizes[1]&&sizes[1]<sizes[2]);
 const a=preview.markup(product),b=preview.markup(product);assert.notEqual(a.match(/id="([^"]+)"/)[1],b.match(/id="([^"]+)"/)[1]);
});
test('opciones desconocidas no inyectan contenido y los demás productos conservan su foto',()=>{
 assert.equal(preview.model({id:1}),null);assert.equal(preview.markup({id:1}),'');
 const image=preview.markup(product,{Color:'<script>',Tamaño:'invalid'});assert.ok(!image.includes('<script>'));assert.match(image,/Negro, 20 pulgadas/);
});
