const { byDataTest } = require('./shared.locators');

module.exports = {
  name: byDataTest('product-name'),
  unitPrice: byDataTest('unit-price'),
  description: byDataTest('product-description'),
  quantity: byDataTest('quantity'),
  increaseQuantity: byDataTest('increase-quantity'),
  decreaseQuantity: byDataTest('decrease-quantity'),
  addToCart: byDataTest('add-to-cart'),
  outOfStock: byDataTest('out-of-stock')
};
