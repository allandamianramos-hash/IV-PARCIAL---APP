import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';

test('manual review slides show one row, reach older batches and recover after mutations',async()=>{
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}});
  const html=await readFile(new URL('../../public/index.html',import.meta.url),'utf8');
  const section=html.match(/<section class="container home-reviews"[\s\S]*?<\/section>/)[0];
  await page.setContent('<html lang="es"><body>'+section+'</body></html>');
  for(const file of ['inicio/style.css','compartido/design.css','compartido/palette.css','comunidad/community.css'])await page.addStyleTag({path:'public/css/'+file});
  await page.clock.install();
  await page.evaluate(()=>{
   window.testReviews=Array.from({length:8},(_,i)=>({id:'review:me:'+i,isOwn:true,name:'Viajero '+i,rating:5,comment:'Una experiencia de viaje para recordar. Reseña '+i,date:new Date(Date.UTC(2026,9,12-i)).toISOString()}));
   window.reviewRequests=[];
   window.RumboApi={json:async(path,options={})=>{
    const url=new URL(path,'https://rumbo.test');
    if(options.method==='DELETE'){window.testReviews=window.testReviews.filter(r=>r.id!==url.searchParams.get('id'));return {deleted:true};}
    if(options.method==='POST'){window.testReviews.unshift({id:'review:me:new',isOwn:true,name:'Nueva reseña',rating:5,comment:JSON.parse(options.body).comment,date:'2026-10-13T00:00:00Z'});return {saved:true};}
    if(window.failNextReview){window.failNextReview=false;throw Error('Error temporal de prueba');}
    const page=Number(url.searchParams.get('page'));window.reviewRequests.push(page);
    return {total:window.testReviews.length,average:5,reviews:window.testReviews.slice(page*6,page*6+6)};
   }};
  });
  await page.addScriptTag({path:'public/js/comunidad/reviews.js'});
  const cards=page.locator('.review-card'),prev=page.locator('[data-reviews-prev]'),next=page.locator('[data-reviews-next]');
  const names=()=>cards.locator('h3').allTextContents();
  const slide=(...indices)=>expect(cards.locator('h3')).toHaveText(indices.map(i=>'Viajero '+i));
  const sideArrows=async()=>{
   const left=await prev.boundingBox(),right=await next.boundingBox(),list=await page.locator('.reviews-list').boundingBox();
   assert.ok(left.x+left.width<=list.x&&right.x>=list.x+list.width);
   for(const arrow of [left,right])assert.ok(Math.abs(arrow.y+arrow.height/2-list.y-list.height/2)<1);
   assert.equal(await prev.innerText(),'');assert.equal(await next.innerText(),'');
   await expect(page.locator('.reviews-position')).toHaveCount(0);
  };
  await expect(cards).toHaveCount(3);assert.deepEqual(await names(),['Viajero 0','Viajero 1','Viajero 2']);
  await expect(prev).toBeDisabled();await expect(next).toBeEnabled();
  const tops=await cards.evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().top));assert.equal(new Set(tops).size,1);
  await sideArrows();
  await mkdir('.runtime/reviews-carousel',{recursive:true});
  await page.locator('#resenas').screenshot({path:'.runtime/reviews-carousel/desktop.png'});
  await next.click();await slide(3,4,5);
  const requests=await page.evaluate(()=>window.reviewRequests.length);
  await page.clock.fastForward(120000);await slide(3,4,5);assert.equal(await page.evaluate(()=>window.reviewRequests.length),requests);
  await page.evaluate(()=>window.failNextReview=true);await next.click();await expect(page.locator('.review-fields [role=status]')).toHaveText('Error temporal de prueba');
  await slide(3,4,5);assert.equal(await cards.count(),3);
  await next.click();await slide(6,7);await expect(next).toBeDisabled();
  for(let i=0;i<2;i++){await cards.first().locator('.review-delete').click();await page.locator('[data-confirm-delete]').click();await expect(page.locator('.review-delete-dialog')).not.toBeVisible();}
  await slide(3,4,5);await expect(cards).toHaveCount(3);
  await prev.click();await slide(0,1,2);
  await page.setViewportSize({width:800,height:1000});await expect(cards).toHaveCount(2);
  await next.click();await slide(2,3);
  await page.setViewportSize({width:390,height:1000});await expect(cards).toHaveCount(1);await slide(2);
  await next.click();await slide(3);await sideArrows();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#resenas').screenshot({path:'.runtime/reviews-carousel/mobile.png'});
  await page.locator('[name=rating][value="5"]').check();await page.locator('[name=comment]').fill('Nueva experiencia de viaje publicada.');await page.locator('[type=submit]').click();
  await expect(cards.locator('h3')).toHaveText(['Nueva reseña']);
  await page.setViewportSize({width:1280,height:1000});await expect(cards).toHaveCount(3);
  await page.evaluate(()=>{window.testReviews=window.testReviews.slice(0,3);window.dispatchEvent(new Event('rumbo:profile-changed'));});await expect(prev).toBeHidden();await expect(next).toBeHidden();
  await page.evaluate(()=>{window.testReviews=Array.from({length:20},(_,i)=>({...window.testReviews[0],id:'review:many:'+i,name:'Viajero '+i}));window.dispatchEvent(new Event('rumbo:profile-changed'));});
  for(let start=0;start<20;start+=3){await slide(...Array.from({length:Math.min(3,20-start)},(_,i)=>start+i));if(start+3<20)await next.click();}
  await expect(next).toBeDisabled();await prev.click();await slide(15,16,17);
  await page.evaluate(()=>{window.testReviews=[];window.dispatchEvent(new Event('rumbo:profile-changed'));});await expect(cards).toHaveCount(0);await expect(page.locator('.reviews-list')).toContainText('Todavía no hay reseñas');await expect(prev).toBeHidden();await expect(next).toBeHidden();
 }finally{await browser.close();}
});
