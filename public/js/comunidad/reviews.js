(()=>{
 const root=document.querySelector('#resenas');if(!root)return;
 try{if(JSON.parse(document.querySelector('#rumbo-bootstrap')?.textContent||'{}').user)root.querySelector('a[href="iniciar-sesion.html"]').hidden=true;}catch{}
 const form=root.querySelector('form'),status=root.querySelector('[role=status]'),list=root.querySelector('.reviews-list');let page=0,loading=0,deleting=false,selected=null,deleteTrigger=null;
 const mobile=matchMedia('(max-width:767px)'),tablet=matchMedia('(max-width:850px)');
 const visibleCount=()=>mobile.matches?1:tablet.matches?2:3;
 const batchSize=6,prev=root.querySelector('[data-reviews-prev]'),next=root.querySelector('[data-reviews-next]'),carousel=root.querySelector('.reviews-carousel');
 let pageSize=visibleCount(),total=0,pending=false,displayedPage=0;
 function controls(){prev.disabled=pending||page===0;next.disabled=pending||(page+1)*pageSize>=total;prev.hidden=next.hidden=total<=pageSize;carousel.classList.toggle('has-controls',total>pageSize);}
 const actions=document.createElement('div');actions.className='review-form-actions';const publish=form.querySelector('[type=submit]');publish.before(actions);actions.append(publish);
 const translate=text=>window.RumboLocale?.translate(text)||text;
 const confirmation=document.createElement('dialog');confirmation.className='locale-dialog review-delete-dialog';confirmation.setAttribute('aria-labelledby','review-delete-title');confirmation.innerHTML='<form method="dialog"><h2 id="review-delete-title">¿Eliminar tu reseña?</h2><blockquote class="review-delete-preview" translate="no"><p class="review-stars"></p><p class="review-comment"></p><time></time></blockquote><p>Tu reseña dejará de ser pública. Podés publicar una nueva cuando querás.</p><footer><button value="cancel" class="button button-outline">Cancelar</button><button type="button" data-confirm-delete class="button button-primary">Eliminar mi reseña</button></footer><p role="status" aria-live="polite"></p></form>';root.append(confirmation);
 const cancel=confirmation.querySelector('[value=cancel]');
 function selectReview(review,button){selected=review;deleteTrigger=button;confirmation.querySelector('[role=status]').textContent='';confirmation.querySelector('.review-comment').textContent=review.comment;confirmation.querySelector('.review-stars').textContent='★'.repeat(review.rating)+'☆'.repeat(5-review.rating);const date=confirmation.querySelector('time');date.dateTime=review.date;date.textContent=new Intl.DateTimeFormat(document.documentElement.lang||'es',{dateStyle:'medium'}).format(new Date(review.date));confirmation.showModal();cancel.focus();}
 confirmation.addEventListener('cancel',event=>{if(deleting)event.preventDefault();});
 confirmation.addEventListener('close',()=>{selected=null;(deleteTrigger?.isConnected?deleteTrigger:list.querySelector('.review-delete')||publish).focus();});
 confirmation.querySelector('[data-confirm-delete]').onclick=async event=>{if(deleting||!selected)return;deleting=true;event.target.disabled=true;cancel.disabled=true;try{const data=await window.RumboApi.json('/api/reviews?id='+encodeURIComponent(selected.id),{method:'DELETE'});if(data.deleted!==true)throw Error('No se confirmó la eliminación. Inténtalo de nuevo.');confirmation.close();say('Tu reseña se eliminó.');await load();(list.querySelector('.review-delete')||publish).focus();}catch(error){confirmation.querySelector('[role=status]').textContent=error.message;}finally{deleting=false;event.target.disabled=false;cancel.disabled=false;}};
 const say=text=>{status.textContent=text;};
 async function load(){
  if(confirmation.open)return;
  const revision=++loading,offset=page*pageSize;
  pending=true;controls();list.setAttribute('aria-busy','true');
  try{const data=await window.RumboApi.json('/api/reviews?page='+Math.floor(offset/batchSize));if(revision!==loading)return;if(!Number.isInteger(data.total)||data.total<0||!Array.isArray(data.reviews)||(data.total>0&&(!Number.isFinite(data.average)||data.average<1||data.average>5)))throw Error('No se pudieron cargar las reseñas. Inténtalo de nuevo.');
   if(confirmation.open)return;
   if(page>0&&offset>=data.total){page=Math.max(0,Math.ceil(data.total/pageSize)-1);return load();}
   total=data.total;displayedPage=page;
   root.querySelector('.reviews-average').textContent=data.total?Number(data.average).toFixed(1):'—';
   root.querySelector('.reviews-count').textContent=data.total+' '+(data.total===1?'reseña':'reseñas');
   root.querySelector('.reviews-stars').textContent=data.total?'★'.repeat(Math.round(data.average))+'☆'.repeat(5-Math.round(data.average)):'☆☆☆☆☆';
   list.replaceChildren();
   if(!data.total){const empty=document.createElement('p');empty.textContent='Todavía no hay reseñas. Contanos cómo te fue usando Rumbo.';list.append(empty);}
   // Both backends return six reviews, newest first. Show only the current slide.
   for(const review of data.reviews.slice(offset%batchSize,offset%batchSize+pageSize)){const card=document.createElement('article');card.className='review-card';card.setAttribute('translate','no');
    const avatar=document.createElement('span');avatar.className='review-avatar';avatar.textContent=Array.from(review.name)[0]?.toUpperCase()||'R';avatar.setAttribute('aria-hidden','true');
    const name=document.createElement('h3');name.textContent=review.name;
    const stars=document.createElement('p');stars.className='review-stars';stars.textContent='★'.repeat(review.rating)+'☆'.repeat(5-review.rating);stars.setAttribute('aria-label',review.rating+' / 5');
    const comment=document.createElement('p');comment.className='review-comment';comment.textContent=review.comment;
    const date=document.createElement('time');date.dateTime=review.date;date.textContent=new Intl.DateTimeFormat(document.documentElement.lang||'es',{dateStyle:'medium'}).format(new Date(review.date));
    card.append(avatar,name,stars,comment,date);
    if(review.isOwn===true&&typeof review.id==='string'){const remove=document.createElement('button');remove.type='button';remove.className='button button-outline review-delete';remove.textContent=translate('Eliminar mi reseña');remove.onclick=()=>selectReview(review,remove);card.append(remove);}
    list.append(card);
   }
  }catch(error){if(revision!==loading||confirmation.open)return;page=displayedPage;if(!list.children.length)list.textContent='No se pudieron cargar las reseñas.';say(error.message);}
  finally{if(revision===loading){pending=false;controls();list.setAttribute('aria-busy','false');}}
 }
 root.querySelectorAll('[name=rating]').forEach(input=>input.addEventListener('change',()=>{root.querySelectorAll('.review-rating label').forEach(label=>label.classList.toggle('is-rated',Number(label.querySelector('input').value)<=Number(input.value)));}));
 form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;say('Publicando…');
  try{if(await window.RumboStorage?.flush?.()===false)throw Error('No se pudo guardar tu perfil. Reintenta antes de publicar.');const data=await window.RumboApi.json('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rating:Number(new FormData(form).get('rating')),comment:form.elements.comment.value})});if(data.saved!==true)throw Error('No se confirmó el guardado. Tu texto se conserva para reintentar.');
   const rating=Number(new FormData(form).get('rating'));say(rating>=4?'Gracias por tu confianza. Nos alegra que disfrutés usando Rumbo.':rating===3?'Gracias por contarnos tu experiencia. Tu opinión nos ayuda a mejorar.':'Gracias por compartir lo que podemos mejorar. Sentimos que tu experiencia no haya sido la esperada.');
   form.reset();root.querySelectorAll('.is-rated').forEach(label=>label.classList.remove('is-rated'));page=0;await load();
  }catch(error){say(error.message);}finally{button.disabled=false;}
 });
 prev.onclick=()=>{if(!pending&&page>0){page--;load();}};next.onclick=()=>{if(!pending&&(page+1)*pageSize<total){page++;load();}};
 function resize(){const size=visibleCount();if(size===pageSize||confirmation.open)return;page=Math.floor(page*pageSize/size);displayedPage=Math.floor(displayedPage*pageSize/size);pageSize=size;load();}
 mobile.addEventListener('change',resize);tablet.addEventListener('change',resize);confirmation.addEventListener('close',resize);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
 window.addEventListener('rumbo:profile-changed',()=>{if(!document.hidden)load();});
 window.addEventListener('rumbo:localechange',()=>{list.querySelectorAll('.review-delete').forEach(button=>{button.textContent=translate('Eliminar mi reseña');});root.querySelectorAll('time[datetime]').forEach(date=>{date.textContent=new Intl.DateTimeFormat(document.documentElement.lang||'es',{dateStyle:'medium'}).format(new Date(date.dateTime));});});
 load();
})();
