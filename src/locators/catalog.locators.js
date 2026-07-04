const { By } = require('selenium-webdriver');
const { byDataTest } = require('./shared.locators');

module.exports = {
  filters: byDataTest('filters'),
  sort: byDataTest('sort'),
  searchInput: byDataTest('search-query'),
  searchReset: byDataTest('search-reset'),
  searchSubmit: byDataTest('search-submit'),
  searchCaption: byDataTest('search-caption'),
  searchTerm: byDataTest('search-term'),
  searchResultCount: byDataTest('search-result-count'),
  noResults: byDataTest('no-results'),
  productCards: By.css('a.card[data-test^="product-"]'),
  productName: byDataTest('product-name'),
  productPrice: byDataTest('product-price'),
  outOfStock: byDataTest('out-of-stock')
};
