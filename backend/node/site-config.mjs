import {readFile} from 'node:fs/promises';
export const siteConfig=JSON.parse(await readFile(new URL('../../config/site-public.json',import.meta.url),'utf8'));
export const analyticsPages=['index.html','tienda.html',...['servicios','traslados','seguros','guias','privacidad','terminos','cookies','cancelaciones','legal'].map(s=>'servicios:'+s),...['destinos','detalle-destino','vuelos','hoteles'].map(s=>'viajes:'+s)];
