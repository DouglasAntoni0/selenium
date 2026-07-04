const { byDataTest } = require('./shared.locators');

module.exports = {
  home: byDataTest('nav-home'),
  contact: byDataTest('nav-contact'),
  signIn: byDataTest('nav-sign-in'),
  cart: byDataTest('nav-cart'),
  cartQuantity: byDataTest('cart-quantity'),
  accountMenu: byDataTest('nav-menu'),
  signOut: byDataTest('nav-sign-out')
};
