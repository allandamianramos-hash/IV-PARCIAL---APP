// Enter actual choices when a scenario needs results; fresh searches start empty.
export async function completeBookingForm(page) {
  const values = {
    'detail-date':'2099-10-12','detail-travelers':'2','detail-nights':'3',
    'flight-destination':'roatan','flight-origin':'Tegucigalpa','flight-date':'2099-10-12','flight-travelers':'2','flight-cabin':'economica',
    'hotel-destination':'roatan','hotel-date':'2099-10-12','hotel-travelers':'2','hotel-nights':'3','hotel-rooms':'1',
    route:'roatan',destination:'roatan',date:'2099-10-12',end:'2099-10-15',people:'2',bags:'2',time:'09:00',direction:'out',language:'es'
  };
  const form=page.locator('#detail-form,#flight-search,#hotel-search,#service-search,#guide-form');
  await form.waitFor();
  for (const field of await form.locator('input,select').all()) {
    const id=await field.getAttribute('id');
    if(await field.inputValue() || !values[id])continue;
    if(await field.evaluate(el=>el.tagName==='SELECT'))await field.selectOption(values[id]);
    else await field.fill(values[id]);
  }
  if(await form.getAttribute('id')!=='detail-form')await form.evaluate(el=>el.requestSubmit());
}
