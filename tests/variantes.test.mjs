import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
const catalog=JSON.parse(await readFile(new URL('../config/store-catalog.json',import.meta.url),'utf8'));
const context={window:{},document:{querySelector:()=>null}};
vm.runInNewContext(await readFile(new URL('../public/js/tienda/tienda.js',import.meta.url),'utf8'),context);
const preview=context.window.RumboVariantPreview;

test('cada combinación mantiene la foto del producto, sin cambiar de modelo',async()=>{
 let count=0;
 for(const product of catalog.products){
  const options=catalog.productOptions[product.id];
  if(!product.preview){assert.equal(preview.model(product),null);continue;}
  count++;const images=new Set();
  for(const [key,values] of Object.entries(options))for(const value of values){
   const v=preview.model(product,{[key]:value});images.add(v.image);assert.equal(v.image,product.image);
   assert.equal(v.options[key],value);assert.ok(v.scale>0&&v.scale<=1);
   assert.ok(!v.summary.includes('undefined'));assert.match(preview.markup(product,v.options),/data-variant-product=/);
  }
  assert.equal(images.size,1,product.name);await access(new URL([...images][0],new URL('../public/',import.meta.url)));
 }
 assert.equal(count,81);
});
test('solo las dimensiones físicas aumentan la escala y siempre conservan proporciones',()=>{
 for(const product of catalog.products.filter(p=>p.preview)){
  const {sizeKey}=product.preview;
  const values=catalog.productOptions[product.id][sizeKey]||[];
  const scales=values.map(value=>preview.model(product,{[sizeKey]:value}).scale);
  for(let i=1;i<scales.length;i++)assert.ok(scales[i]>scales[i-1],product.name);
 }
 const usb=catalog.products.find(p=>p.name==='Memoria USB');
 assert.equal(preview.model(usb,{Capacidad:'32 GB'}).scale,preview.model(usb,{Capacidad:'128 GB'}).scale);
});
test('opciones inexistentes no se interpolan y no afectan al precio',()=>{
 for(const product of catalog.products.filter(p=>p.preview)){
  const clean=preview.model(product,{Color:'<script>',Tamaño:'invalid',Extra:'" onload="alert(1)'});
  assert.doesNotMatch(preview.markup(product,clean.options),/<script>|onload=/);
  assert.equal(context.window.RumboProductPrice(product,{Color:'<script>'}),context.window.RumboProductPrice(product,{}));
  assert.ok(!('Extra' in clean.options));
 }
});
