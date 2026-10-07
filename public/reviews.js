(()=>{
 const root=document.querySelector('#resenas');if(!root)return;
 try{if(JSON.parse(document.querySelector('#rumbo-bootstrap')?.textContent||'{}').user)root.querySelector('a[href="iniciar-sesion.html"]').hidden=true;}catch{}
 const form=root.querySelector('form'),status=root.querySelector('[role=status]'),list=root.querySelector('.reviews-list');let page=0;
 const say=text=>{status.textContent=text;};
 async function load(){
  try{const response=await fetch('/api/reviews?page='+page);const data=await response.json();if(!response.ok)throw Error(data.error);
   root.querySelector('.reviews-average').textContent=data.total?Number(data.average).toFixed(1):'—';
   root.querySelector('.reviews-count').textContent=data.total+' '+(data.total===1?'reseña':'reseñas');
   root.querySelector('.reviews-stars').textContent=data.total?'★'.repeat(Math.round(data.average))+'☆'.repeat(5-Math.round(data.average)):'☆☆☆☆☆';
   list.replaceChildren();
   if(!data.total){const empty=document.createElement('p');empty.textContent='Todavía no hay reseñas. Contanos cómo te fue usando Rumbo.';list.append(empty);}
   for(const review of data.reviews){const card=document.createElement('article');card.className='review-card';card.setAttribute('translate','no');
    const avatar=document.createElement('span');avatar.className='review-avatar';avatar.textContent=Array.from(review.name)[0]?.toUpperCase()||'R';avatar.setAttribute('aria-hidden','true');
    const name=document.createElement('h3');name.textContent=review.name;
    const stars=document.createElement('p');stars.className='review-stars';stars.textContent='★'.repeat(review.rating)+'☆'.repeat(5-review.rating);stars.setAttribute('aria-label',review.rating+' / 5');
    const comment=document.createElement('p');comment.className='review-comment';comment.textContent=review.comment;
    const date=document.createElement('time');date.dateTime=review.date;date.textContent=new Intl.DateTimeFormat(document.documentElement.lang||'es',{dateStyle:'medium'}).format(new Date(review.date));
    card.append(avatar,name,stars,comment,date);list.append(card);
   }
   root.querySelector('[data-reviews-prev]').disabled=page===0;root.querySelector('[data-reviews-next]').disabled=(page+1)*6>=data.total;
   root.querySelector('.reviews-pagination').hidden=data.total<=6;
  }catch(error){list.textContent='No se pudieron cargar las reseñas.';say(error.message);}
 }
 root.querySelectorAll('[name=rating]').forEach(input=>input.addEventListener('change',()=>{root.querySelectorAll('.review-rating label').forEach(label=>label.classList.toggle('is-rated',Number(label.querySelector('input').value)<=Number(input.value)));}));
 form.addEventListener('submit',async event=>{event.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;say('Publicando…');
  try{const response=await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rating:Number(new FormData(form).get('rating')),comment:form.elements.comment.value})});const data=await response.json();if(!response.ok)throw Error(data.error);
   const rating=Number(new FormData(form).get('rating'));say(rating>=4?'Gracias por tu confianza. Nos alegra que disfrutés usando Rumbo.':rating===3?'Gracias por contarnos tu experiencia. Tu opinión nos ayuda a mejorar.':'Gracias por compartir lo que podemos mejorar. Sentimos que tu experiencia no haya sido la esperada.');
   form.reset();root.querySelectorAll('.is-rated').forEach(label=>label.classList.remove('is-rated'));page=0;await load();
  }catch(error){say(error.message);}finally{button.disabled=false;}
 });
 root.querySelector('[data-reviews-prev]').onclick=()=>{page--;load();};root.querySelector('[data-reviews-next]').onclick=()=>{page++;load();};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
 setInterval(()=>{if(!document.hidden)load();},60000);
 load();
})();
