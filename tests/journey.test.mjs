import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const sources=await Promise.all(['viajes.js','tienda.js','journey.js'].map(f=>readFile(new URL(f, new URL('../public/', import.meta.url)),'utf8')));
function setup(){const data=new Map(),context={window:{},document:{querySelector:()=>null},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};vm.createContext(context);vm.runInContext(sources[0].slice(0,sources[0].indexOf('/* Abre una')),context);vm.runInContext(sources[1],context);vm.runInContext(sources[2],context);const write=(k,v)=>data.set(k,JSON.stringify(v));write('rumbo.integrante2.viaje.v1',{destinationId:'roatan',origin:'Tegucigalpa',date:'2099-10-12',checkIn:'2099-10-12',travelers:1,nights:3,cabin:'economica',rooms:1,roomType:'estandar',flightId:'roatan-0-0',hotelId:'paradise'});return {write,journey:context.window.RumboJourney};}
test('viaje completo reúne vuelo y hotel sin pedir seleccionarlos otra vez',()=>{const {journey}=setup(),s=journey.snapshot();assert.equal(s.issues.length,0);assert.equal(s.total,7700);assert.equal(s.paid,false);});

test('Mi viaje recalcula el descuento al pasar de tres a dos viajeros',()=>{
  const {write,journey}=setup();
  const trip={destinationId:'roatan',origin:'Tegucigalpa',date:'2099-10-12',checkIn:'2099-10-12',travelers:3,nights:3,cabin:'economica',rooms:2,roomType:'estandar',flightId:'roatan-0-0',hotelId:'paradise'};
  write('rumbo.integrante2.viaje.v1',trip);
  assert.equal(journey.snapshot().items.find(i=>i.key==='vuelos').total,9120);
  assert.equal(journey.snapshot().items.find(i=>i.key==='hoteles').total,9000);
  write('rumbo.integrante2.viaje.v1',{...trip,travelers:2});
  assert.equal(journey.snapshot().items.find(i=>i.key==='vuelos').total,6400);
});
test('el resumen incluye variantes y cantidades de la tienda',()=>{const {write,journey}=setup();write('rumbo.store.cart.v2',[{id:1,quantity:2,options:{Tamaño:'Grande'}},{id:1,quantity:1,options:{Tamaño:'Mediana'}}]);assert.equal(journey.snapshot().total,9250);});
test('el ticket requiere cierre explícito y se invalida al modificar el viaje',()=>{const {write,journey}=setup();let s=journey.snapshot();write('rumbo.checkout.v1',{signature:s.signature,demo:true,code:'TEST'});assert.equal(journey.snapshot().paid,true);write('rumbo.store.cart.v2',[{id:2,quantity:1}]);assert.equal(journey.snapshot().paid,false);});
test('se detectan servicios de otras fechas o viajeros',()=>{const {write,journey}=setup();write('rumbo.services.v1',[{section:'seguros',title:'Plan',detail:'Otro viaje',total:100,values:{date:'2099-10-12',end:'2099-10-13',people:'2'}}]);assert.equal(journey.snapshot().issues.length,1);});

test('eliminar vuelo y hospedaje conserva la otra selección y actualiza el total',()=>{const {journey}=setup();assert.equal(journey.removeItem('vuelos'),true);let s=journey.snapshot();assert.equal(s.items.some(i=>i.key==='vuelos'),false);assert.equal(s.items.some(i=>i.key==='hoteles'),true);assert.equal(journey.undoRemoval(),true);assert.equal(journey.snapshot().total,7700);assert.equal(journey.removeItem('hoteles'),true);assert.deepEqual(Array.from(journey.snapshot().items,i=>i.key),['vuelos']);});
test('eliminar un producto conserva las otras variantes',()=>{const {write,journey}=setup();write('rumbo.store.cart.v2',[{id:1,quantity:2,options:{Tamaño:'Grande'}},{id:1,quantity:1,options:{Tamaño:'Mediana'}}]);assert.equal(journey.removeItem('tienda',0),true);const items=journey.snapshot().items.filter(i=>i.key==='tienda');assert.equal(items.length,1);assert.match(items[0].detail,/Mediana/);assert.equal(journey.undoRemoval(),true);assert.equal(journey.snapshot().total,9250);});
test('vaciar el viaje elimina todas las selecciones y permite deshacer',()=>{const {write,journey}=setup();write('rumbo.store.cart.v2',[{id:1,quantity:1}]);write('rumbo.services.v1',[{section:'seguros',title:'Plan',detail:'Ejemplo',total:100}]);const total=journey.snapshot().total;assert.equal(journey.clearTrip(),true);assert.equal(journey.snapshot().items.length,0);assert.equal(journey.snapshot().total,0);assert.equal(journey.undoRemoval(),true);assert.equal(journey.snapshot().total,total);assert.equal(journey.undoRemoval(),false);});
test('cada servicio puede eliminarse sin afectar a los otros',()=>{const {write,journey}=setup();write('rumbo.services.v1',['traslados','seguros','guias'].map(section=>({section,title:section,detail:'Ejemplo',total:100})));assert.equal(journey.removeItem('seguros'),true);assert.deepEqual(Array.from(journey.snapshot().items,i=>i.key),['vuelos','hoteles','traslados','guias']);});
test('una eliminación invalida el pago incluso si luego se restaura la selección',()=>{const {write,journey}=setup();write('rumbo.checkout.v1',{signature:journey.snapshot().signature,demo:true,code:'TEST'});journey.removeItem('hoteles');journey.undoRemoval();assert.equal(journey.snapshot().paid,false);});
