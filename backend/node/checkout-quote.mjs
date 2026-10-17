// Both PHP and Node use this pricing engine. No submitted amounts or card data.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const [travelSource,journeySource]=await Promise.all(['destinos/viajes.js','servicios/journey.js'].map(p=>readFile(new URL('../../public/js/'+p,import.meta.url),'utf8')));
const travelData=travelSource.slice(0,travelSource.indexOf('/* Abre una'));
export class CheckoutError extends Error { constructor(message,status=400){super(message);this.status=status;} }
const rounded=n=>Math.round(n*100)/100;
const keys={store:['rumbo.store.cart.v2'],trip:['rumbo.integrante2.viaje.v1','rumbo.services.v1','rumbo.no-flight.v1']};
export function checkoutQuote(kind,state,catalog){
  if(!Object.hasOwn(keys,kind))throw new CheckoutError('Tipo de compra inválido.');
  let items,title,trip=null,signature=null;
  if(kind==='store'){
    const cart=state['rumbo.store.cart.v2']?.value;
    if(!Array.isArray(cart)||!cart.length)throw new CheckoutError('Tu carrito está vacío.');
    items=cart.map(row=>{
      const product=catalog.products.find(p=>p.id===row.id);
      if(!product||!Number.isInteger(row.quantity)||row.quantity<1||row.quantity>99)throw new CheckoutError('Revisa los productos del carrito.');
      const allowed=catalog.productOptions[row.id]||{},options=row.options||{};
      if(Object.keys(options).some(k=>!Array.isArray(allowed[k])||!allowed[k].includes(options[k]))||Object.keys(allowed).some(k=>!options[k]))throw new CheckoutError('Revisa las opciones de los productos.');
      const unit=rounded(Number(product.price)+Object.entries(options).reduce((sum,[k,v])=>sum+Number(catalog.priceAdjustments[row.id]?.[k]?.[v]||0),0));
      return {key:String(row.id),label:'Producto',title:product.name,detail:Object.entries(options).map(([k,v])=>k+': '+v).join(' · '),quantity:row.quantity,unit,total:rounded(unit*row.quantity)};
    });
    title='Compra en la tienda';
  }else{
    const context={window:{RumboDatabase:{catalog}},localStorage:{getItem:key=>JSON.stringify(state[key]?.value??null)}};
    vm.createContext(context);vm.runInContext(travelData,context,{timeout:1500});vm.runInContext(journeySource,context,{timeout:1500});
    const s=vm.runInContext('window.RumboJourney.snapshot()',context,{timeout:1500});
    if(s.issues.length)throw new CheckoutError('Completa y revisa las selecciones de tu viaje.');
    items=JSON.parse(JSON.stringify(s.items));title=s.d.name;signature=s.signature;
    trip={destinationId:s.d.id,destination:s.d.name,start:s.t.date,end:s.end,travelers:s.t.travelers};
  }
  const total=rounded(items.reduce((sum,i)=>sum+i.total,0));
  if(!items.length||!Number.isFinite(total)||total<=0||total>1e9)throw new CheckoutError('El importe de la selección no es válido.');
  // Includes revisions so buying the same products again after editing is possible.
  const fingerprint=createHash('sha256').update(JSON.stringify({kind,state:keys[kind].map(k=>[k,state[k]?.revision||0,state[k]?.value??null]),items})).digest('hex');
  return {kind,title,items,total,currency:'HNL',demo:true,trip,signature,fingerprint};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{let input='';for await(const chunk of process.stdin){input+=chunk;if(input.length>3e6)throw Error('Input too large');}const {kind,state,catalog}=JSON.parse(input);process.stdout.write(JSON.stringify({quote:checkoutQuote(kind,state,catalog)}));}
  catch(error){process.stdout.write(JSON.stringify({error:error instanceof CheckoutError?error.message:'No se pudo preparar el pago.',status:error.status||503}));}
}
