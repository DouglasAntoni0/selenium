const env = require('../config/environment');
const { requestJson } = require('./httpClient');

async function fetchProducts(query = '') {
  const url = new URL(`${env.apiUrl}/products`);
  url.searchParams.set('page', '1');
  url.searchParams.set('is_rental', 'false');
  if (query) url.searchParams.set('q', query);

  return requestJson(url);
}

async function findPurchasableProduct(preferredQuery = 'Hammer') {
  const result = await fetchProducts(preferredQuery);
  const products = result.data || [];
  const candidates = products.filter((item) => item.in_stock && !item.is_rental);
  const product = candidates.find((item) => {
    const hasCommercialDiscount = Boolean(item.discount_price || item.discount_percentage);
    const qualifiesForEcoDiscount = item.is_eco_friendly || ['A', 'B'].includes(String(item.co2_rating || '').toUpperCase());
    return !hasCommercialDiscount && !qualifiesForEcoDiscount;
  }) || candidates[0];

  if (!product) {
    throw new Error(`No purchasable product found for query "${preferredQuery}"`);
  }

  return product;
}

module.exports = {
  fetchProducts,
  findPurchasableProduct
};
