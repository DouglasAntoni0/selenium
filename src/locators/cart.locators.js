const { By } = require('selenium-webdriver');
const { byDataTest } = require('./shared.locators');

module.exports = {
  productTitle: byDataTest('product-title'),
  quantity: byDataTest('product-quantity'),
  productPrice: byDataTest('product-price'),
  linePrice: byDataTest('line-price'),
  subtotal: byDataTest('cart-subtotal'),
  discount: byDataTest('cart-discount'),
  ecoDiscount: byDataTest('cart-eco-discount'),
  total: byDataTest('cart-total'),
  continueShopping: byDataTest('continue-shopping'),
  proceedToLogin: byDataTest('proceed-1'),
  removeItem: By.css('table tbody tr .btn.btn-danger'),
  emptyCartMessage: By.css('app-cart p')
};
