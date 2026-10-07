// Offline catalogues shared by the HTML pages and the React hero.
(()=>{
 'use strict';
 const normalize=text=>text.replace(/\s+/g,' ').trim();
 const escape=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const loaded=new Map(),compiled=new Map();
 const supported=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
 async function load(language){
  if(!supported.includes(language))throw Error('Idioma no disponible.');
  if(language==='es')return;
  if(!loaded.has(language))loaded.set(language,(async()=>{
   const response=await fetch('/locales/'+language+'.json');if(!response.ok)throw Error('No se pudo cargar el idioma. Inténtalo de nuevo.');
   const data=await response.json();if(!data||typeof data!=='object'||Array.isArray(data))throw Error('No se pudo cargar el idioma.');
   window.RumboTranslations[language]={...data,...window.RumboTranslations[language]};compiled.delete(language);
  })().catch(error=>{loaded.delete(language);throw error;}));
  return loaded.get(language);
 }
 function catalog(language){
  if(compiled.has(language))return compiled.get(language);
  const exact=new Map(),folded=new Map(),patterns=[];
  for(const [key,value] of Object.entries(window.RumboTranslations?.[language]||{})){
   if(typeof value!=='string')continue;const source=normalize(key);exact.set(source,value);folded.set(source.toLocaleLowerCase(),value);
   if(/\{\w+\}/.test(source)&&(source.replace(/\{\w+\}/g,'').trim().length>=8||/^[\p{L}]/u.test(source)&&source.replace(/\{\w+\}/g,'').trim().length>=3)){
    const keys=[];const pattern=source.split(/(\{\w+\})/).map(part=>/^\{\w+\}$/.test(part)?(keys.push(part),'(.*?)'):escape(part)).join('');
    const optionalTail=pattern.endsWith(' (.*?)')?pattern.slice(0,-6)+'(?: (.*?))?':pattern;
    patterns.push({regex:new RegExp('^'+optionalTail+'$','u'),keys,value,weight:source.replace(/\{\w+\}/g,'').length});
   }
  }
  patterns.sort((a,b)=>b.weight-a.weight);
  // Compound labels contain numbers, prices, destinations and punctuation.
  const phrases=[...exact.keys()].filter(key=>!/[{}<>]/.test(key)&&/[\p{L}]/u.test(key)).sort((a,b)=>b.length-a.length);
  const fragments=phrases.length?new RegExp('(?=(?<![\\p{L}\\p{N}_])('+phrases.map(escape).join('|')+')(?![\\p{L}\\p{N}_]))','giu'):null;
  const result={exact,folded,patterns,fragments};compiled.set(language,result);return result;
 }
 function translate(text,language,depth=0){
  if(language==='es'||!text||depth>4||/^\s*(?:rumbo|rumbito)\s*$/i.test(text))return text;
  const clean=normalize(text),{exact,folded,patterns,fragments}=catalog(language);
  let output=exact.get(clean)??folded.get(clean.toLocaleLowerCase());
  if(output===undefined){for(const pattern of patterns){const match=clean.match(pattern.regex);if(!match)continue;output=pattern.value.replace(/\{\w+\}/g,key=>{const index=pattern.keys.indexOf(key);return index<0?key:translate(match[index+1]??'',language,depth+1);});break;}}
  if(output===undefined){
   const matches=fragments?[...clean.matchAll(fragments)].map(m=>({start:m.index,end:m.index+m[1].length,text:m[1]})).sort((a,b)=>b.text.length-a.text.length):[];
   const selected=[];for(const match of matches)if(!selected.some(other=>match.start<other.end&&match.end>other.start))selected.push(match);
   let cursor=0;output='';for(const match of selected.sort((a,b)=>a.start-b.start)){output+=clean.slice(cursor,match.start)+(exact.get(match.text)??folded.get(match.text.toLocaleLowerCase()));cursor=match.end;}output+=clean.slice(cursor);
  }
  const months=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  output=output.replace(/\b(\d{1,2}) (?:de )?(ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sept?(?:iembre)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?)\.? (?:de )?(\d{4})\b/gi,(whole,day,month,year)=>{
   const index=months.findIndex(name=>name.startsWith(month.slice(0,3).toLowerCase()));const date=new Date(Date.UTC(Number(year),index,Number(day)));
   return date.getUTCDate()===Number(day)?new Intl.DateTimeFormat(language,{day:'numeric',month:month.length>4?'long':'short',year:'numeric',timeZone:'UTC'}).format(date):whole;
  });
  return text.match(/^\s*/)[0]+output+text.match(/\s*$/)[0];
 }
 window.RumboI18n={load,translate,normalize,invalidate:language=>compiled.delete(language)};
})();
