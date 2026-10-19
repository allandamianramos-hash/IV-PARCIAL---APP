import {existsSync} from 'node:fs';
// Hosted HTML is rendered by Node; it must not be served as a static asset.
const directory=new URL('../../templates/',import.meta.url);
const fallback=new URL('../../public/',import.meta.url);
export const htmlTemplate=name=>new URL(name,existsSync(directory)?directory:fallback);
