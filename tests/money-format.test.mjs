import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {validState} from '../backend/node/database-api.mjs';
const source=await readFile(new URL('../public/js/idiomas/preferences.js',import.meta.url),'utf8');
test('HNL amounts always use comma grouping regardless of interface language',()=>{
 for(const language of ['es','en','de','fr','it','pt','ja','ko','zh','ar']){
  const scope={window:{},localStorage:{getItem:()=>JSON.stringify({language,region:'HN'})},document:{querySelector:()=>null}};
  vm.runInNewContext(source,scope);
  assert.equal(scope.window.RumboLocale.formatMoney(30000),'L 30,000');
  assert.equal(scope.window.RumboLocale.formatMoney(1234.5),'L 1,234.5');
 }
});
test('partial user searches persist without inventing numeric defaults',()=>{
 assert.equal(validState('rumbo.integrante2.viaje.v1',{destinationId:'roatan',date:'2099-10-12',travelers:2,searchConfigured:true}),true);
 assert.equal(validState('rumbo.integrante2.viaje.v1',{searchConfigured:'true'}),false);
 assert.equal(validState('rumbo.integrante2.viaje.v1',{rooms:''}),false);
});
