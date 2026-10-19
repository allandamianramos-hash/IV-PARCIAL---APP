// Assemble a Linux runtime release. Private configuration is supplied in hPanel.
import {cp,mkdir,readFile,readdir,writeFile,stat,statfs} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const publicEntries=await readdir(join(root,'public'),{recursive:true,withFileTypes:true});
let assetBytes=0;
for(const file of publicEntries)if(file.isFile())assetBytes+=(await stat(join(file.parentPath,file.name))).size;
const disk=await statfs(root),required=Math.ceil(assetBytes*2.2)+100*1024*1024;
if(disk.bavail*disk.bsize<required)throw Error('No hay espacio suficiente para preparar otra publicación. Libera al menos '+Math.ceil(required/1024/1024)+' MB antes de continuar. No se ha creado otra copia.');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const output=resolve(root,'.runtime','hostinger','release-'+stamp);
await mkdir(output,{recursive:true});
for(const path of ['public','backend/node','server.mjs','hostinger.mjs'])await cp(join(root,path),join(output,path),{recursive:true});
await mkdir(join(output,'config'),{recursive:true});
for(const file of await readdir(join(root,'config')))if(file.endsWith('.json'))await cp(join(root,'config',file),join(output,'config',file));
const source=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
const runtime=['bcryptjs','google-auth-library','jose','mssql','nodemailer'];
const pkg={name:source.name,version:source.version,private:true,type:'module',engines:{node:'>=22.12'},scripts:{start:'node hostinger.mjs',build:'node --check server.mjs && node --check hostinger.mjs'},dependencies:Object.fromEntries(runtime.map(name=>[name,source.dependencies[name]]))};
await writeFile(join(output,'package.json'),JSON.stringify(pkg,null,2)+'\n');
// Include only the dependency tree needed by this runtime, using npm's lockfile
// resolver afterward to retain the exact source versions where possible.
const lock=JSON.parse(await readFile(join(root,'package-lock.json'),'utf8'));
lock.packages['']={name:pkg.name,version:pkg.version,dependencies:pkg.dependencies,engines:pkg.engines};
await writeFile(join(output,'package-lock.json'),JSON.stringify(lock,null,2)+'\n');
const manifest=[];
for(const file of await readdir(output,{recursive:true,withFileTypes:true})){
  if(!file.isFile())continue;
  const path=join(file.parentPath,file.name),relative=path.slice(output.length+1).replaceAll('\\','/');
  if(/(?:^|\/)(?:\.env(?:\..*)?|node_modules|\.git|\.runtime)(?:\/|$)/.test(relative))throw Error('Archivo privado en el paquete: '+relative);
  if(relative==='package-lock.json')continue;
  manifest.push({path:relative,sha256:createHash('sha256').update(await readFile(path)).digest('hex')});
}
await writeFile(resolve(output,'..','manifest-'+stamp+'.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({directory:output,files:manifest.length,archive:output+'.zip'}));
