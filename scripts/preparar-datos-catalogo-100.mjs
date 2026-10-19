import {readFile,writeFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const cities=JSON.parse(await readFile('docs/catalogo-100/ciudades.json','utf8'));
const source=await readFile('public/js/destinos/viajes.js','utf8'),scope={window:{}};
vm.runInNewContext(source.slice(0,source.indexOf('/* Abre una')),scope);
vm.runInNewContext(await readFile('public/js/destinos/guias-catalogo.js','utf8'),scope);
const existing=scope.window.RumboViajesDatos;
assert.equal(existing.destinations.length,70);
for(const d of existing.destinations){assert.equal(d.hotels.length,5);assert.equal(scope.window.RumboGuias.filter(g=>g.destination===d.id).length,10);assert.equal(existing.flights(d,existing.origins[0]).length,6);}
const hotelNames=['Casa del Patio','Estancia del Parque','Suites del Paseo','Terraza del Centro','Residencia del Mirador'];
const experiences=cities.flatMap(city=>city.places.map((place,i)=>{
 const style=/mercado|market|saluhall|torvehallerne|halles|quincy|quadrilatero|feria/i.test(place)?'gastronomia':/playa|beach|waik/i.test(place)?'playa':/parque|park|jard[ií]n|garden|colina|mount|monte |albufera|rambla|riberas|lago|paseo|viaduct|panecillo/i.test(place)?'naturaleza':'cultura';
 const descriptions={gastronomia:`Recorré ${place} para conocer sus puestos y sabores. El acompañamiento orienta la visita; las consumiciones se pagan aparte.`,playa:`Paseo por ${place} con tiempo para recorrer la costa y tomar fotografías. No incluye actividades acuáticas.`,naturaleza:`Caminata por ${place}, con pausas para apreciar el paisaje y los espacios abiertos. El ritmo se ajusta al recorrido.`,cultura:`Visita centrada en ${place}, su historia y sus espacios más representativos. Los accesos interiores dependen de los horarios y entradas disponibles.`};
 return {id:city.id+'-experiencia-'+(i+1),destination:city.id,title:place+' · '+({gastronomia:'sabores locales',playa:'paseo por la costa',naturaleza:'al aire libre',cultura:'historia y arquitectura'}[style]),style,description:descriptions[style],stops:[`Punto de encuentro en ${place}`,`Recorrido por ${place}`,`Cierre y orientación para continuar la visita`],hours:style==='naturaleza'?3:2,price:Math.round((420+i*55)*(city.hotelBase>=2800?1.5:1)),photoContext:`Fotografía de referencia de ${city.name}; no representa necesariamente todas las paradas del recorrido.`};
}));
const hotels=cities.flatMap(city=>hotelNames.map((name,i)=>({id:city.id+'-estancia-'+(i+1),destination:city.id,name:name+' · '+city.name,stars:[3,3,4,4,5][i],area:'Zona por confirmar con el alojamiento',rate:Math.round(city.hotelBase*[1,1.15,1.35,1.55,1.9][i]),amenities:i<2?['Wi-Fi','Aire acondicionado']:i<4?['Wi-Fi','Desayuno','Aire acondicionado']:['Wi-Fi','Desayuno','Estacionamiento','Aire acondicionado'],imageAlt:`Habitación de referencia de ${name}; alojamiento de demostración para ${city.name}.`})));
const audit={existing:{destinations:70,experiences:700,hotels:350,flightsPerOrigin:6,origins:existing.origins,roomTypes:Object.keys(existing.rooms),transportTypes:3,insurancePlans:4},addition:{destinations:30,experiences:experiences.length,hotels:hotels.length,flightOptionsPerOrigin:180},expected:{destinations:100,experiences:1000,hotels:500},status:'Pendiente de fotografías verificadas, integración, pruebas de interfaz y sincronización con Azure. El catálogo publicado no se ha modificado.'};
assert.equal(new Set(cities.map(c=>c.id)).size,30);assert.ok(cities.every(c=>!existing.destinations.some(d=>d.id===c.id)));assert.equal(experiences.length,300);assert.equal(hotels.length,150);
for(const [file,data] of [['experiencias.json',experiences],['hospedajes.json',hotels],['auditoria.json',audit]])await writeFile('docs/catalogo-100/'+file,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(audit,null,2));
