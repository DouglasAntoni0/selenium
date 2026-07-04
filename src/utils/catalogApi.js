const env = require('../config/environment');
const { requestJson } = require('./httpClient');

async function fetchProducts(query = '') {
  const url = new URL(`${env.apiUrl}/products`);
  url.searchParams.set('page', '1');
  url.searchParams.set('is_rental', 'false');
  if (query) url.searchParams.set('q', query);

  return requestJson(url);
}

function pickPurchasableProduct(products) {
  const candidates = products.filter((item) => item.in_stock && !item.is_rental);
  return candidates.find((item) => {
    const hasCommercialDiscount = Boolean(item.discount_price || item.discount_percentage);
    const qualifiesForEcoDiscount = item.is_eco_friendly || ['A', 'B'].includes(String(item.co2_rating || '').toUpperCase());
    return !hasCommercialDiscount && !qualifiesForEcoDiscount;
  }) || candidates[0];
}

async function findPurchasableProduct(preferredQuery = 'Hammer') {
  const searchStrategies = [preferredQuery, ''];

  for (const query of searchStrategies) {
    const result = await fetchProducts(query);
    const product = pickPurchasableProduct(result.data || []);
    if (product) return product;
  }

  throw new Error(`No purchasable product found for query "${preferredQuery}" or the default catalog`);
}

module.exports = {
  fetchProducts,
  findPurchasableProduct
};
