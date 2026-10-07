import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
const scope={window:{},fetch:async url=>({ok:true,json:async()=>JSON.parse(await readFile(new URL('../public'+url,import.meta.url),'utf8'))})};
vm.createContext(scope);for(const file of ['translations.js','locale-engine.js'])vm.runInContext(await readFile(new URL('../public/js/idiomas/'+file,import.meta.url),'utf8'),scope);
test('all catalogs contain every source message and preserve interpolation fields',async()=>{const es=JSON.parse(await readFile(new URL('../public/locales/es.json',import.meta.url),'utf8'));for(const lang of ['en','de','fr','it','pt','ja','ko','zh','ar']){const data=JSON.parse(await readFile(new URL('../public/locales/'+lang+'.json',import.meta.url),'utf8'));for(const key of Object.keys(es)){assert.equal(typeof data[key],'string',lang+': '+key);assert.deepEqual((data[key].match(/\{\w+\}/g)||[]).sort(),(key.match(/\{\w+\}/g)||[]).sort(),lang+': '+key);}}});
test('translation preserves amounts, dynamic counts, templates and Spanish',async()=>{const t=scope.window.RumboI18n;await t.load('en');assert.equal(t.translate('  Buscar mi viaje  ','en'),'  Find my trip  ');assert.equal(t.translate('Vuelo a Venecia','en'),'Flight to Venice');assert.match(t.translate('24 reseñas','en'),/24 reviews/);assert.match(t.translate('Desde L 18,000 por persona','en'),/18,000/);assert.equal(t.translate('Texto original','es'),'Texto original');assert.match(t.translate('{destination},\n{discount}% menos.','en'),/\{discount\}% off/);});

test('all active translations are free of tokenizer markers and preserve literal credits',async()=>{
 for(const lang of ['en','de','fr','it','pt','ja','ko','zh','ar']){
  await scope.window.RumboI18n.load(lang);
  for(const [source,text] of Object.entries(scope.window.RumboTranslations[lang])){
   assert.doesNotMatch(text,/▁|@@/,lang+': '+source);
   if(!source.includes('_'))assert.doesNotMatch(text.replace(/\{\w+\}/g,''),/_/,lang+': '+source);
  }
  assert.equal(scope.window.RumboI18n.translate('daryl_mitchell from Saskatoon, Saskatchewan, Canada',lang),'daryl_mitchell from Saskatoon, Saskatchewan, Canada');
  assert.match(scope.window.RumboI18n.translate('Acerca de Rumbo',lang),/Rumbo/);
 }
});
