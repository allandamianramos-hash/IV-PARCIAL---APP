import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read=f=>readFileSync(new URL('../public/'+f,import.meta.url),'utf8');
const travel=read('viajes.js'), services=read('servicios.js');
const data={window:{}};
vm.runInNewContext(travel.slice(0,travel.indexOf('/* Abre una')),data);
const catalog=data.window.RumboViajesDatos.destinations;
function page(section,destination){
 const nodes=new Map(),storage=new Map();let choices=[];
 function node(id){
  if(nodes.has(id))return nodes.get(id);
  const n={id,name:id,value:'',events:{},dataset:{},disabled:false,options:[],textContent:'',
   addEventListener(type,fn){this.events[type]=fn;},setAttribute(){},setCustomValidity(){},checkValidity(){return true;},reportValidity(){return true;},
   get selectedOptions(){return this.options.filter(o=>o.value===this.value);},
   get innerHTML(){return this.html||'';},set innerHTML(html){this.html=html;if(id==='service-results')choices=[...html.matchAll(/data-choose="([^"]+)"/g)].map(([,id])=>({dataset:{choose:id},setAttribute(){},closest(){return {dataset:{}}}}));}
  };nodes.set(id,n);return n;
 }
 const root={classList:{add(){}},querySelector:s=>node(s.slice(1)),querySelectorAll:()=>choices,
  set innerHTML(html){
   for(const [,id,value]of html.matchAll(/<input id="([^"]+)"[^>]* value="([^"]*)"/g))node(id).value=value;
   for(const [,id,options]of html.matchAll(/<select id="([^"]+)"[^>]*>(.*?)<\/select>/g)){
    node(id).options=[...options.matchAll(/<option value="([^"]+)">(.*?)<\/option>/g)].map(([,value,textContent])=>({value,textContent}));node(id).value=node(id).options[0].value;
   }
  }
 };
 node('service-search').querySelectorAll=()=>[...nodes.values()].filter(n=>n.value);
 const location={search:'?seccion='+section+'&destino='+destination};
 vm.runInNewContext(services,{window:{RumboViajesDatos:data.window.RumboViajesDatos,addEventListener(){}},document:{querySelector:()=>root},location,URLSearchParams,Date,setTimeout,
  localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
  FormData:class{*[Symbol.iterator](){for(const n of nodes.values())if(n.value)yield[n.name,n.value];}}
 });
 return {node,storage,location,choose(){node('service-results').events.click({target:{closest:()=>choices[0]}});},submit(){node('service-search').events.submit({preventDefault(){}});}};
}
test('los 40 destinos permiten calcular y guardar su propio traslado',()=>{
 for(const d of catalog){
  const ui=page('traslados',d.id);
  assert.match(ui.node('results-count').textContent,/3 opciones/);
  assert.ok(ui.node('results-count').textContent.includes(d.name));
  assert.doesNotMatch(ui.node('service-results').innerHTML,/NaN|undefined/);
  ui.choose();ui.node('save-service').events.click();
  const saved=JSON.parse(ui.storage.get('rumbo.services.v1'))[0];
  assert.equal(saved.destinationId,d.id);assert.ok(saved.total>0);
  assert.equal(ui.location.href,'servicios.html?seccion=seguros');
 }
});
test('capacidad de pasajeros y maletas elimina vehículos insuficientes',()=>{
 const ui=page('traslados','paris');ui.node('people').value='12';ui.node('bags').value='12';ui.submit();
 assert.match(ui.node('results-count').textContent,/1 opción/);assert.match(ui.node('service-results').innerHTML,/Van para grupos/);assert.doesNotMatch(ui.node('service-results').innerHTML,/Auto privado/);
});
test('seguros calcula cuatro planes según zona, días y viajeros',()=>{
 const ui=page('seguros','paris');ui.node('date').value='2099-10-12';ui.node('end').value='2099-10-14';ui.node('people').value='2';ui.submit();
 assert.equal(ui.node('zone').value,'internacional');assert.match(ui.node('results-count').textContent,/4 opciones/);
 assert.match(ui.node('service-results').innerHTML,/Cancelación y asistencia/);
 ui.choose();ui.node('save-service').events.click();const saved=JSON.parse(ui.storage.get('rumbo.services.v1'))[0];
 assert.equal(saved.total,35*3*2*2);assert.equal(saved.destinationId,'paris');
});
