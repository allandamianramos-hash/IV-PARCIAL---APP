import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../public/js/cuenta/auth-client.js',import.meta.url),'utf8');
function page(readyState='interactive',signedIn=true){
  const events={},windowEvents={},redirects=[];
  let header=null;
  const node=()=>({children:[],classList:{add(){}},setAttribute(){},append(...items){this.children.push(...items);},contains(){return false;},focus(){this.focused=true;},addEventListener(type,fn){this[type]=fn;}});
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
  const menu=header.children[0],panel=menu.children[1];
  assert.equal(menu.className,'account-menu');
  assert.equal(panel.children[0].children[0].children.map(n=>n.textContent).join(''),'Hola, Viajera');
  assert.deepEqual(panel.children[1].children.map(n=>n.href),['servicios.html?seccion=perfil','servicios.html?seccion=mi-viaje','tienda.html?carrito=1']);
  menu.open=true;p.events.keydown({key:'Escape'});assert.equal(menu.open,false);assert.equal(menu.children[0].focused,true);
  await panel.children[2].click();
  assert.deepEqual(p.redirects,['index.html']);
});

test('una página ya cargada muestra la cuenta y el visitante conserva los enlaces',()=>{
  const signed=page('complete'),header=signed.buildHeader();signed.run();
  assert.equal(header.children[0].className,'account-menu');
  const guest=page('interactive',false);guest.run();const links=guest.buildHeader();guest.events.DOMContentLoaded();
  assert.deepEqual(links.children,['Iniciar sesión','Registrarse']);
});

test('Live Server conserva su puerto y solo reconecta al solicitarlo',async()=>{
  const common=await readFile(new URL('../public/js/compartido/connection.js',import.meta.url),'utf8');
  const redirects=[];
  const scope={window:{},fetch:async url=>({ok:true,json:async()=>url.endsWith('/api/database')?({connected:true}):({app:'rumbo-viajes',backend:'php'})}),AbortSignal,URL,

    document:{getElementById:()=>null},
    location:{protocol:'http:',hostname:'127.0.0.1',port:'5500',pathname:'/public/servicios.html',search:'?seccion=mi-viaje',hash:'#perfil',replace:url=>redirects.push(url)}
  };
  vm.runInNewContext(common,scope);
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(redirects,[]);
  assert.equal(await scope.window.RumboConnect(),true);
  assert.deepEqual(redirects,['http://127.0.0.1:5500/servicios.html?seccion=mi-viaje#perfil']);
});

test('cerrar sesión se detiene si falla el guardado y respeta la página de error',async()=>{
  const p=page('complete'),header=p.buildHeader();let requests=0;
  p.scope.window.RumboStorage={flush:async()=>false,hasPending:()=>true};
  p.scope.fetch=async()=>{requests++;return {ok:true,json:async()=>({ok:true})};};
  p.run();const panel=header.children[0].children[1];await panel.children[2].click();
  assert.equal(requests,0);assert.deepEqual(p.redirects,[]);assert.match(panel.children[3].textContent,/guardar tus cambios/);
});

test('cambiar de sesión desde otra pestaña conserva los cambios pendientes',async()=>{
  const p=page('complete');p.buildHeader();let errorCode,deleted=0;
  p.scope.window.RumboStorage={hasPending:()=>true,reportError:code=>errorCode=code};
  p.scope.localStorage.removeItem=()=>deleted++;
  p.scope.fetch=async()=>({ok:true,json:async()=>({user:null})});
  p.run();await p.windowEvents.focus();
  assert.equal(errorCode,'session');assert.equal(deleted,0);assert.deepEqual(p.redirects,[]);
});
