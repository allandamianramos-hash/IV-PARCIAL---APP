import {readFileSync} from 'node:fs';

const reviewed=JSON.parse(readFileSync(new URL('../../config/store-catalog.json',import.meta.url),'utf8'));
const byId=new Map(reviewed.products.map(product=>[product.id,product]));

// Presentation and available variants are versioned with the app; SQL still owns prices.
export function applyStoreCatalog(catalog) {
  return {...catalog,storeCatalogRevision:reviewed.revision,
    products:catalog.products.map(product=>byId.has(product.id)?{...product,...byId.get(product.id),price:product.price}:product),
    productOptions:{...catalog.productOptions,...reviewed.productOptions},
    priceAdjustments:{...catalog.priceAdjustments,...Object.fromEntries(reviewed.products.map(p=>[p.id,reviewed.priceAdjustments[p.id]||{}]))}
  };
}
