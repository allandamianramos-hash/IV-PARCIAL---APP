// Collect only the site's source text. No environment files, accounts or reviews.
import ts from 'typescript';
import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
import vm from 'node:vm';
const texts=new Set();
for(const key of Object.keys(JSON.parse(readFileSync('scripts/i18n/store-reviewed-en.json','utf8'))))texts.add(key);
const selectedFiles=process.argv.slice(2);
if(selectedFiles.length){
 for(const key of Object.keys(JSON.parse(readFileSync('public/locales/es.json','utf8'))))texts.add(key);
 for(const key of Object.keys(JSON.parse(readFileSync('scripts/i18n/reviewed-en.json','utf8'))))texts.add(key);
}
const clean=s=>s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
function add(raw){const s=clean(raw);if(s.length<2||!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(s)||s.length>2500)return;
 if(/(?:https?:|mailto:|tel:|\.html|\.js|\.css|\.jpg|\.png|\.webp|\.svg|\.json|\.v1|\.v2|application\/|^data-|^aria-|^[#.[]|=>|===|\bSELECT\b|\bFROM\b|\bfunction\b)/.test(s))return;
 if(!/[\sáéíóúüñÁÉÍÓÚÜÑ¿¡]/.test(s)&&!(/^[A-Z][a-z]+$/.test(s)))return;
 if(/[<>]|prefers-reduced-motion|\b(?:classList|textContent|querySelector|fetchImpl|type=|value=)\b/.test(s)||s.startsWith('"'))return;
 if(/^[a-z]+(?:-[a-z0-9]+)+$/.test(s)||/^[A-Z_]+$/.test(s)||/^[\d\s{}.,:%/\-]+$/.test(s))return;
 texts.add(s);
}
function html(value){
 value=value.replace(/<!--[^]*?-->/g,'').replace(/<style\b[^>]*>[^]*?<\/style>/gi,'');
 for(const m of value.matchAll(/<script\b([^>]*)>([^]*?)<\/script>/gi))if(!/src=|application\//.test(m[1]))js(m[2]);
 value=value.replace(/<script\b[^>]*>[^]*?<\/script>/gi,'');
 for(const m of value.matchAll(/\b(?:placeholder|aria-label|title|alt)=["']([^"']+)["']/g))add(m[1]);
 value.split(/<[^>]*>/g).forEach(add);
}
function js(source,file='file.js'){
 const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.JS);
 const accept=s=>/[<>]/.test(s)&&/<[a-z!/]/i.test(s)?html(s):add(s);
 function visit(n){
  if(ts.isTemplateExpression(n)){let s=n.head.text;n.templateSpans.forEach((span,i)=>{s+='{'+i+'}'+span.literal.text;});accept(s);}
  else if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)){if(!(ts.isPropertyAssignment(n.parent)&&n.parent.name===n))accept(n.text);}
  else if(ts.isJsxText(n))add(n.text);
  ts.forEachChild(n,visit);
 }visit(tree);
}
for(const file of selectedFiles.length?selectedFiles:readdirSync('public',{recursive:true})){if(/(?:hero|translations|locale-engine|policies)\.js$/.test(file))continue;if(file.endsWith('.html'))html(readFileSync('public/'+file,'utf8'));else if(file.endsWith('.js'))js(readFileSync('public/'+file,'utf8'));}
if(!selectedFiles.length){
js(readFileSync('src/hero/main.tsx','utf8'),'main.tsx');
js(readFileSync('backend/node/error-pages.mjs','utf8'));
for(const text of JSON.parse(readFileSync('scripts/i18n/catalog-texts.json','utf8')))add(text);
texts.add('. Adaptada para la web.');
// Public server validation messages are user-facing too.
for(const dir of ['backend/php','backend/node'])for(const file of readdirSync(dir)){const raw=readFileSync(dir+'/'+file,'utf8');for(const m of raw.matchAll(/(?:error\s*:|HttpError\([^,]+,|throw (?:new )?Error\()\s*['"]([^'"\n]+)['"]/g))add(m[1]);}
}
const sandbox={window:{}};vm.runInNewContext(readFileSync('public/js/idiomas/translations.js','utf8'),sandbox);for(const key of Object.keys(sandbox.window.RumboTranslations.es))texts.add(clean(key));
// The reviewed shop catalog can change independently of the older SQL snapshot.
const storeCatalog=JSON.parse(readFileSync('config/store-catalog.json','utf8'));
for(const product of storeCatalog.products)for(const field of ['name','description','imageAlt','category'])if(product[field])add(product[field]);
for(const options of Object.values(storeCatalog.productOptions))for(const [label,values]of Object.entries(options)){add(label);values.forEach(add);}
mkdirSync('public/locales',{recursive:true});
mkdirSync('.runtime',{recursive:true});
writeFileSync('public/locales/es.json',JSON.stringify(Object.fromEntries([...texts].sort().map(s=>[s,s])),null,2)+'\n');
writeFileSync('.runtime/i18n-reviewed.json',JSON.stringify(sandbox.window.RumboTranslations));
console.log(texts.size+' source messages');
