import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../public/auth-client.js',import.meta.url),'utf8');
function page(readyState='interactive',signedIn=true){
  const events={},windowEvents={},redirects=[];
  let header=null;
  const node=()=>({classList:{add(){}},setAttribute(){},addEventListener(type,fn){this[type]=fn;}});
  const scope={
    document:{readyState,addEventListener:(type,fn)=>{events[type]=fn;},
      querySelector(selector){
        if(selector==='#rumbo-bootstrap')return {textContent:JSON.stringify({user:signedIn?{id:'test',name:'Viajera de prueba'}:null})};
        return selector==='.account-actions'?header:null;
      },querySelectorAll:()=>[],createElement:node},
    window:{addEventListener:(type,fn)=>{windowEvents[type]=fn;}},
    sessionStorage:{getItem:()=>null,removeItem(){}},localStorage:{removeItem(){},setItem(){}},
    location:{replace:url=>redirects.push(url),reload:()=>redirects.push('reload')},
    fetch:async()=>({ok:true,json:async()=>({ok:true})}),AbortSignal
  };
  return {events,windowEvents,redirects,scope,
    buildHeader(){header={...node(),children:['Iniciar sesión','Registrarse'],replaceChildren(...children){this.children=children;}};return header;},
    run(){vm.runInNewContext(source,scope);}};
}

test('la sesión espera al encabezado creado por los scripts defer',async()=>{
  const p=page();p.run();
  assert.equal(typeof p.events.DOMContentLoaded,'function');
  const header=p.buildHeader();p.events.DOMContentLoaded();
  assert.deepEqual(header.children.map(n=>n.textContent),['Viajera de prueba','Cerrar sesión',undefined]);
  await header.children[1].click();
  assert.deepEqual(p.redirects,['index.html']);
});

test('una página ya cargada muestra la cuenta y el visitante conserva los enlaces',()=>{
  const signed=page('complete'),header=signed.buildHeader();signed.run();
  assert.equal(header.children[0].textContent,'Viajera de prueba');
  const guest=page('interactive',false);guest.run();const links=guest.buildHeader();guest.events.DOMContentLoaded();
  assert.deepEqual(links.children,['Iniciar sesión','Registrarse']);
});

test('Live Server dirige las páginas estáticas a PHP conservando host, ruta y sección',async()=>{
  const common=await readFile(new URL('../public/common.js',import.meta.url),'utf8');
  const redirects=[];
  vm.runInNewContext(common,{
    document:{getElementById:()=>null},
    location:{protocol:'http:',hostname:'127.0.0.1',port:'5500',pathname:'/public/servicios.html',search:'?seccion=mi-viaje',hash:'#perfil',replace:url=>redirects.push(url)}
  });
  assert.deepEqual(redirects,['http://127.0.0.1:8000/servicios.html?seccion=mi-viaje#perfil']);
});
