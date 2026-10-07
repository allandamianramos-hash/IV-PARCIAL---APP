let cached,pending;
export const currencies=['HNL','USD','MXN','EUR','GBP','CAD','BRL','JPY','KRW','CNY','AED','GTQ','CRC','COP','ARS','CLP','PEN'];
export async function exchangeApi(req,res){
 if(new URL(req.url,'http://localhost').pathname!=='/api/exchange-rates')return false;
 const send=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
 if(req.method!=='GET'){send(405,{error:'Método no permitido.'});return true;}
 try{
  if(!cached||Date.now()-cached.loaded>86400000){
   pending??=(async()=>{const response=await fetch('https://open.er-api.com/v6/latest/HNL',{signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error();const data=await response.json();if(data.result!=='success'||data.base_code!=='HNL'||!currencies.every(c=>Number.isFinite(data.rates?.[c])&&data.rates[c]>0))throw Error();cached={loaded:Date.now(),date:data.time_last_update_utc,rates:Object.fromEntries(currencies.map(c=>[c,data.rates[c]]))};})();
   try{await pending;}finally{pending=null;}
  }
  send(200,{base:'HNL',date:cached.date,rates:cached.rates});
 }catch{send(503,{error:'No se pudo consultar el tipo de cambio. Se mantienen los precios en lempiras.'});}
 return true;
}
