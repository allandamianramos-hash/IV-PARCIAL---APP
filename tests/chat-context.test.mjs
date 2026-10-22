import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chatContext,chatHistory} from '../backend/node/chat-context.mjs';

test('el contexto reducido conserva el destino elegido y los precios del catálogo',()=>{
 const trips=Array.from({length:70},(_,i)=>({id:'d'+i,name:i===69?'Kioto':'Destino '+i,description:'x'.repeat(1000),inspirationBudget:100+i}));
 const products=Array.from({length:100},(_,i)=>({name:i===99?'Maleta':'Producto '+i,price:i+1}));
 const context={trips,products,flights:()=>[{economy:234}]};
 const text=chatContext(context,'Quiero una maleta para Kioto',{destination:'d68'});
 const data=JSON.parse(text);
 assert.equal(data.destinations[0].id,'d68');
 assert.ok(data.destinations.some(d=>d.id==='d69'&&d.budgetHNL===169&&d.flightFromHNL===234));
 assert.equal(data.products[0].name,'Maleta');
 assert.ok(text.length<6000);
 assert.equal(trips.length,70);
});

test('el historial conserva los mensajes recientes completos y su orden dentro del presupuesto',()=>{
 const history=Array.from({length:12},(_,i)=>({role:i%2?'assistant':'user',content:String(i).padEnd(2000,'x')}));
 assert.deepEqual(chatHistory(history),history.slice(-2));
});
