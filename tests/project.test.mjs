import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('.', new URL('../public/', import.meta.url)));
const files = await readdir(root,{recursive:true});

test('todos los scripts compilan antes de iniciar el sitio', () => {
  for (const file of files.filter(name => /\.(?:js|mjs)$/.test(name))) {
    const result = spawnSync(process.execPath, ['--check', resolve(root, file)], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${file}: ${result.stderr}`);
  }
});

test('no quedan conflictos de Git en los archivos de la aplicación', async () => {
  for (const file of files.filter(name => /\.(?:html|css|js|mjs)$/.test(name))) {
    const source = await readFile(resolve(root, file), 'utf8');
    assert.doesNotMatch(source, /^(?:<{7} .*|={7}|>{7} .*)$/m, file);
  }
});

test('cada página tiene un documento, recursos existentes y scripts sin duplicar', async () => {
  for (const file of files.filter(name => name.endsWith('.html'))) {
    const rawHtml = await readFile(resolve(root, file), 'utf8');
    for (const [, attributes, source] of rawHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\bsrc\s*=|type=["'](?:application\/ld\+json|application\/json)["']/i.test(attributes)) new vm.Script(source, { filename: file });
    }
    // Las plantillas dentro de JS no son nodos ni recursos HTML del documento.
    const html = rawHtml.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    for (const tag of ['html', 'head', 'body']) {
      assert.equal([...html.matchAll(new RegExp(`<${tag}(?:\\s|>)`, 'gi'))].length, 1, `${file}: <${tag}> duplicado`);
      assert.equal([...html.matchAll(new RegExp(`</${tag}>`, 'gi'))].length, 1, `${file}: cierre de ${tag}`);
    }
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => m[1].split('?')[0]);
    assert.equal(new Set(scripts).size, scripts.length, `${file}: script cargado dos veces`);
    const ids = [...html.replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, '').matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${file}: identificadores duplicados`);
    for (const [, url] of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
      if (/^(?:https?:|mailto:|tel:|#|data:)/.test(url)) continue;
      const path = url.split(/[?#]/)[0];
      if (path) await access(resolve(root, path.replace(/^\//,'')));
    }
  }
});

test('el catálogo compartido funciona fuera de la tienda y sus imágenes existen', async () => {
  const context = { window: {}, document: { querySelector: () => null } };
  vm.runInNewContext(await readFile(resolve(root, 'js/tienda/tienda.js'), 'utf8'), context);
  const products = context.window.RumboProducts;
  assert.ok(products.length >= 30);
  assert.equal(new Set(products.map(p => p.id)).size, products.length);
  for (const product of products) {
    assert.ok(Number.isFinite(product.price) && product.price > 0);
    await access(resolve(root, product.image));
  }
});

