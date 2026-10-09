(()=>{
'use strict';
const languages=[['es','Español'],['en','English'],['de','Deutsch'],['fr','Français'],['it','Italiano'],['pt','Português'],['ja','日本語'],['ko','한국어'],['zh','中文（普通话）'],['ar','العربية']];
// La bandera representa el idioma; la región solo determina la moneda.
const languageFlags={es:'es',en:'gb',de:'de',fr:'fr',it:'it',pt:'pt',ja:'jp',ko:'kr',zh:'cn',ar:'ae'};
const regions=[['HN','Honduras','HNL'],['US','Estados Unidos','USD'],['MX','México','MXN'],['ES','España','EUR'],['DE','Deutschland','EUR'],['FR','France','EUR'],['IT','Italia','EUR'],['PT','Portugal','EUR'],['GB','United Kingdom','GBP'],['CA','Canada','CAD'],['BR','Brasil','BRL'],['JP','日本','JPY'],['KR','대한민국','KRW'],['CN','中国','CNY'],['AE','الإمارات العربية المتحدة','AED'],['GT','Guatemala','GTQ'],['CR','Costa Rica','CRC'],['CO','Colombia','COP'],['AR','Argentina','ARS'],['CL','Chile','CLP'],['PE','Perú','PEN']];
let prefs={language:'es',region:'HN'},rates={HNL:1};try{const saved=JSON.parse(localStorage.getItem('rumbo.preferences.v1'));if(languages.some(x=>x[0]===saved?.language)&&regions.some(x=>x[0]===saved?.region))prefs=saved;}catch{}
const sources=new WeakMap(),attrs=new WeakMap();let observer,queued=false,lastLocale='';
const currency=()=>regions.find(x=>x[0]===prefs.region)[2];
// Los importes usan siempre coma de miles y punto decimal, independientemente del idioma.
const formatHNL=(value,minimumFractionDigits=0)=>'L '+new Intl.NumberFormat('en-US',{useGrouping:true,minimumFractionDigits,maximumFractionDigits:2}).format(value);
function money(value){const c=currency();return new Intl.NumberFormat('en-US',{style:'currency',currency:c,currencyDisplay:'code',useGrouping:true,maximumFractionDigits:['JPY','KRW','CLP'].includes(c)?0:2}).format(value*rates[c]);}
function translate(text){return window.RumboI18n.translate(String(text),prefs.language);}
function convert(text){return text.replace(/\bL\.?\s*([0-9](?:[0-9,.]*[0-9])?)/g,(full,amount)=>{const match=amount.match(/^(.*)[.,](\d{1,2})$/);const value=match?Number(match[1].replace(/[.,]/g,'')+'.'+match[2]):Number(amount.replace(/[.,]/g,''));return Number.isFinite(value)?(currency()==='HNL'||!rates[currency()]?formatHNL(value,match?.[2].length||0):money(value)):full;});}
// React owns its translated DOM; the generic walker must not rewrite its text nodes.
window.RumboLocale={get language(){return prefs.language;},translate,
 originalText(element){return [...element.childNodes].map(node=>sources.get(node)?.original||node.textContent).join('');},
 formatMoney(value){return currency()==='HNL'||!rates[currency()]?formatHNL(value):money(value);}};
function update(){
 observer?.disconnect();
 document.documentElement.lang=prefs.language;document.documentElement.dir=prefs.language==='ar'?'rtl':'ltr';
 // Option values are application data even when HTML omitted an explicit value.
 document.querySelectorAll('option:not([value])').forEach(option=>option.setAttribute('value',option.value));
 const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  if(!node.parentElement||node.parentElement.closest('script,style,textarea,[translate=no],.locale-toggle,.review-card,a[href^="mailto:"],a[href^="tel:"]'))continue;
  const previous=sources.get(node),original=previous&&previous.output===node.nodeValue?previous.original:node.nodeValue;
  const output=convert(translate(original));if(output!==node.nodeValue)node.nodeValue=output;sources.set(node,{original,output});
 }
 document.querySelectorAll('[placeholder],[aria-label],[aria-description],[title],[alt],meta[name=description]').forEach(el=>{
  if(el.closest('[translate=no]'))return;
  const remembered=attrs.get(el)||{};for(const key of ['placeholder','aria-label','aria-description','title','alt',...(el.matches('meta[name=description]')?['content']:[])]){if(!el.hasAttribute(key))continue;const value=el.getAttribute(key),old=remembered[key],original=old?.output===value?old.original:value;const output=translate(original);if(value!==output)el.setAttribute(key,output);remembered[key]={original,output};}attrs.set(el,remembered);
 });
 const flag=toggle.querySelector('img');flag.src='https://flagcdn.com/w40/'+languageFlags[prefs.language]+'.png';flag.alt=languages.find(([code])=>code===prefs.language)[1];toggle.querySelector('span').textContent=prefs.language.toUpperCase()+' · '+currency();toggle.setAttribute('aria-label',translate('Idioma y región'));observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','aria-description','title','alt','content']});
 const localeKey=prefs.language+'|'+currency()+'|'+rates[currency()];
 if(localeKey!==lastLocale){lastLocale=localeKey;window.dispatchEvent(new Event('rumbo:localechange'));}
}
const header=document.querySelector('.header-actions')||document.querySelector('.header-inner');if(!header)return;
const toggle=document.createElement('button');toggle.type='button';toggle.className='locale-toggle';toggle.setAttribute('aria-haspopup','dialog');toggle.innerHTML='<img width="20" height="15" alt="HN"><span></span>';header.prepend(toggle);
const dialog=document.createElement('dialog');dialog.className='locale-dialog';dialog.innerHTML='<form method="dialog"><header><h2>Idioma y región</h2><button value="cancel" aria-label="Cerrar" class="locale-close">×</button></header><div class="locale-columns"><section><label for="rumbo-language">Idioma</label><select id="rumbo-language">'+languages.map(([code,name])=>'<option value="'+code+'">'+name+'</option>').join('')+'</select><p>El idioma de la navegación y los controles. Las reseñas se muestran en su idioma original.</p></section><section><label for="rumbo-region">Región y moneda</label><select id="rumbo-region">'+regions.map(([code,name,c])=>'<option value="'+code+'">'+name+' · '+c+'</option>').join('')+'</select><p>La conversión es orientativa. Los importes originales y el resumen descargable se conservan en HNL.</p><small><a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by ExchangeRate-API</a></small></section></div><p class="locale-status" role="status" aria-live="polite"></p><footer><button value="cancel" class="button button-outline">Cancelar</button><button type="button" class="button button-primary" data-apply>Guardar preferencias</button></footer></form>';
document.body.append(dialog);const language=dialog.querySelector('#rumbo-language'),region=dialog.querySelector('#rumbo-region'),status=dialog.querySelector('[role=status]');
toggle.onclick=()=>{language.value=prefs.language;region.value=prefs.region;status.textContent='';dialog.showModal();};dialog.addEventListener('close',()=>toggle.focus());
async function loadRates(){const data=await window.RumboApi.json('/api/exchange-rates',{signal:AbortSignal.timeout(12000)});if(data.base!=='HNL'||!data.rates||!regions.every(([, ,code])=>Number.isFinite(data.rates[code])&&data.rates[code]>0)||!Number.isFinite(Date.parse(data.date)))throw Error('No se recibió un tipo de cambio válido. Se mantienen los precios actuales.');rates=data.rates;status.textContent='Tipo de cambio: '+new Intl.DateTimeFormat(prefs.language,{dateStyle:'medium'}).format(new Date(data.date));}
dialog.querySelector('[data-apply]').onclick=async event=>{const button=event.target;button.disabled=true;try{await window.RumboI18n.load(language.value);let nextRegion=region.value;let warning='';if(nextRegion!=='HN'&&!rates[regions.find(x=>x[0]===nextRegion)[2]])try{await loadRates();}catch(error){nextRegion=prefs.region;warning=error.message;}prefs={language:language.value,region:nextRegion};try{localStorage.setItem('rumbo.preferences.v1',JSON.stringify(prefs));}catch{}update();if(warning){region.value=nextRegion;status.textContent=warning;}else dialog.close();}catch(error){status.textContent=error.message||'No se pudo cargar el idioma. Inténtalo de nuevo.';}finally{button.disabled=false;}};
observer=new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;update();});}});
if(prefs.region!=='HN'){loadRates().then(update).catch(()=>{prefs.region='HN';update();status.textContent='No se pudo actualizar el cambio. Precios en HNL.';});}
update();
window.RumboI18n.load(prefs.language).then(()=>{window.RumboI18n.invalidate(prefs.language);lastLocale='';update();}).catch(error=>{status.textContent=error.message;});
})();
