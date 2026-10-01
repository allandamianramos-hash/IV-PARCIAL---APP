import {readFile,writeFile} from 'node:fs/promises';
const source=await readFile(new URL('../docs/MANUAL-PARA-EL-EQUIPO.md',import.meta.url),'utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const inline=s=>esc(s).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/https:\/\/[^\s<]+/g,url=>`<a href="${url}">${url}</a>`);
let out='',list='',code=false;
for(const line of source.split(/\r?\n/)){
 if(line.startsWith('```')){if(list){out+=`</${list}>`;list='';}out+=code?'</code></pre>':'<pre><code>';code=!code;continue;}
 if(code){out+=esc(line)+'\n';continue;}
 const item=/^(\d+\.|-) (.*)$/.exec(line);
 if(item){const tag=item[1]==='-'?'ul':'ol';if(list!==tag){if(list)out+=`</${list}>`;out+=tag==='ol'?`<ol start="${parseInt(item[1],10)}">`:'<ul>';list=tag;}out+=`<li>${inline(item[2])}</li>`;continue;}
 if(list){out+=`</${list}>`;list='';}
 if(!line.trim())continue;
 const head=/^(#{1,2}) (.*)$/.exec(line);
 out+=head?`<h${head[1].length}>${inline(head[2])}</h${head[1].length}>`:`<p>${inline(line)}</p>`;
}
if(list)out+=`</${list}>`;
await writeFile(new URL('../docs/MANUAL-PARA-EL-EQUIPO.html',import.meta.url),`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rumbo — Manual para el equipo</title><style>body{font:18px/1.65 system-ui,Arial,sans-serif;color:#203337;background:#f3f7f6;margin:0}main{max-width:900px;margin:30px auto;background:white;padding:36px 44px;border-radius:14px}h1,h2{line-height:1.25;color:#135861}h1{font-size:34px}h2{font-size:25px;margin-top:42px;border-top:1px solid #dce7e5;padding-top:22px}li{margin:10px 0}pre{background:#eef4f3;padding:20px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:15px}a{color:#135861;overflow-wrap:anywhere}.print-note{font-size:15px;color:#516369}@media(max-width:650px){main{margin:0;padding:24px}body{font-size:17px}}@media print{body{background:white;font-size:11pt}main{margin:0;padding:0;max-width:none}h2{break-after:avoid}pre,li{break-inside:avoid}.print-note{display:none}@page{margin:18mm}}</style></head><body><main><p class="print-note">Puedes enviar este archivo por correo o mensajería. Se abre con cualquier navegador, sin instalar nada. Para guardarlo como PDF: Ctrl+P → Guardar como PDF.</p>${out}</main></body></html>`,'utf8');
console.log('Manual HTML generado.');
