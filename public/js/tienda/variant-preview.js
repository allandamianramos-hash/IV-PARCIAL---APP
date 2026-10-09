/* One transparent source photo per product, shared by every color and size. */
(() => {
  'use strict';
  const prepared=new Map(),stages=new WeakMap();
  const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const COLORS={Negro:[38,43,48],Azul:[52,78,113],Rojo:[150,49,58],Verde:[106,123,96],
    Gris:[132,137,142],Blanco:[229,231,228],Rosa:[192,139,153],Beige:[191,173,143],
    Café:[128,78,45],Turquesa:[42,127,137],Naranja:[189,100,45],Borgoña:[116,48,67],
    Dorado:[181,145,77],Plateado:[175,181,185]};
  const luminance=(r,g,b)=>.2126*r+.7152*g+.0722*b;
  function hue(r,g,b){
    const high=Math.max(r,g,b),low=Math.min(r,g,b),d=high-low;
    if(!d)return 0;
    return ((high===r?(g-b)/d:high===g?(b-r)/d+2:(r-g)/d+4)*60+360)%360;
  }
  function loadImage(src){return new Promise((resolve,reject)=>{
    const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;
  });}
  function canvas(width,height){const c=document.createElement('canvas');c.width=width;c.height=height;return c;}
  async function prepare(product,model){
    if(prepared.has(product.id))return prepared.get(product.id);
    const promise=(async()=>{
      const photo=await loadImage(model.image),factor=Math.min(1,720/Math.max(photo.width,photo.height));
      const layer=canvas(Math.round(photo.width*factor),Math.round(photo.height*factor));
      const ctx=layer.getContext('2d',{willReadFrequently:true});ctx.drawImage(photo,0,0,layer.width,layer.height);
      const original=ctx.getImageData(0,0,layer.width,layer.height),pixels=original.data;
      const weights=new Float32Array(pixels.length/4),shades=new Float32Array(weights.length);
      const referenceHue=hue(...(COLORS[product.preview.baseColor]||COLORS.Gris));
      const neutral=['Negro','Gris','Blanco','Plateado'].includes(product.preview.baseColor);
      let left=layer.width,top=layer.height,right=0,bottom=0,total=0,weightSum=0;
      for(let n=0;n<weights.length;n++){
        const i=n*4;if(pixels[i+3]<8)continue;
        const x=n%layer.width,y=Math.floor(n/layer.width);
        left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
        const r=pixels[i],g=pixels[i+1],b=pixels[i+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
        const saturation=(hi-lo)/Math.max(hi,1),light=luminance(r,g,b);
        const distance=Math.abs(hue(r,g,b)-referenceHue),angle=Math.min(distance,360-distance);
        let weight=neutral?clamp((.35-saturation)/.2)*clamp((245-light)/35):clamp((saturation-.025)/.06)*clamp((80-angle)/30);
        // Keep dark hardware, metallic highlights and the exact source alpha.
        weight*=clamp((light-12)/24);weights[n]=weight;
        total+=light*weight;weightSum+=weight;shades[n]=light;
      }
      if(right<left||bottom<top)throw Error('Empty product photo');
      const average=Math.max(45,total/Math.max(1,weightSum));
      for(let n=0;n<shades.length;n++)if(weights[n])shades[n]=Math.pow(shades[n]/average,.65);
      return {original,weights,shades,width:layer.width,height:layer.height,bounds:{left,top,width:right-left+1,height:bottom-top+1}};
    })();
    prepared.set(product.id,promise);if(prepared.size>12)prepared.delete(prepared.keys().next().value);
    promise.catch(()=>prepared.delete(product.id));return promise;
  }
  function render(state){
    const {asset,view,paint,model}=state,ctx=view.getContext('2d'),source=asset.original.data,out=paint.data;
    out.set(source);
    if(state.current.original<.9999&&model.color){
      for(let n=0;n<asset.weights.length;n++){
        const weight=asset.weights[n]*(1-state.current.original);if(weight<.001)continue;
        const i=n*4,shade=asset.shades[n],highlight=clamp((shade-1.6)/2)*.12;
        for(let c=0;c<3;c++)out[i+c]=mix(source[i+c],mix(state.current.channels[c]*shade,255,highlight),weight);
      }
    }
    state.layerContext.putImageData(paint,0,0);ctx.clearRect(0,0,view.width,view.height);
    const b=asset.bounds,fullFit=Math.min(view.width*.84/b.width,view.height*.84/b.height),fit=fullFit*state.current.scale;
    const ground=(view.height+b.height*fullFit)/2,width=b.width*fit,height=b.height*fit;
    ctx.drawImage(state.layer,b.left,b.top,b.width,b.height,(view.width-width)/2,ground-height,width,height);
  }
  function animate(state,model,immediate){
    cancelAnimationFrame(state.frame);state.model=model;
    const target={channels:COLORS[model.color]||COLORS[state.product.preview.baseColor]||COLORS.Gris,
      scale:model.scale,original:model.color===state.product.preview.baseColor?1:0};
    const from=state.current||target,start=performance.now();
    const duration=immediate||matchMedia('(prefers-reduced-motion: reduce)').matches?0:460;
    state.host.dataset.animating=duration?'true':'false';
    const tick=now=>{
      if(!state.host.isConnected)return;
      const progress=duration?clamp((now-start)/duration):1,ease=1-Math.pow(1-progress,3);
      state.current={scale:mix(from.scale,target.scale,ease),original:mix(from.original,target.original,ease),channels:target.channels.map((v,i)=>mix(from.channels[i],v,ease))};
      render(state);
      if(progress<1)state.frame=requestAnimationFrame(tick);
      else{state.host.dataset.animating='false';state.host.dataset.color=model.color||'';state.host.dataset.scale=String(model.scale);}
    };tick(start);
  }
  async function update(host,product,options,immediate=false){
    if(!host||!product?.preview)return;
    const model=window.RumboVariantPreview.model(product,options);
    host.setAttribute('aria-label',product.name+', '+model.summary);
    let state=stages.get(host);
    if(state){state.pending=model;if(state.asset)animate(state,model,immediate);return;}
    state={host,product,pending:model};stages.set(host,state);
    try{
      const asset=await prepare(product,model);if(!host.isConnected)return;
      const w=host.classList.contains('cart-item-image')?192:768;
      state.asset=asset;state.view=canvas(w,w);state.view.setAttribute('aria-hidden','true');
      state.layer=canvas(asset.width,asset.height);state.layerContext=state.layer.getContext('2d');
      state.paint=state.layerContext.createImageData(asset.width,asset.height);
      host.replaceChildren(state.view);host.dataset.ready='true';animate(state,state.pending,true);
    }catch{host.dataset.ready='error';stages.delete(host);}
  }
  function mount(root=document){
    root.querySelectorAll('[data-variant-product]:not([data-ready])').forEach(host=>{
      if(stages.has(host))return;
      const product=window.RumboProducts?.find(p=>p.id===Number(host.dataset.variantProduct));
      let options;try{options=JSON.parse(host.dataset.variantOptions);}catch{options={};}
      update(host,product,options,true);
    });
  }
  window.RumboVariantRenderer={update,mount,colors:COLORS};
  document.addEventListener('DOMContentLoaded',()=>{
    if(!document.querySelector('#products-grid'))return;
    mount();const observer=new MutationObserver(()=>mount());
    for(const id of ['product-detail','cart-items']){const target=document.getElementById(id);if(target)observer.observe(target,{childList:true,subtree:true});}
  });
})();
