const BasePage = require('./BasePage');
const product = require('../locators/product.locators');
const navigation = require('../locators/navigation.locators');
const { parseMoney } = require('../utils/money');
const { waitForText, waitForVisible } = require('../utils/waits');

class ProductPage extends BasePage {
  async openProduct(productId) {
    await this.open(`/product/${productId}`);
    await waitForVisible(this.driver, product.name);
  }

  async productName() {
    return this.text(product.name);
  }

  async unitPrice() {
    return parseMoney(await this.text(product.unitPrice));
  }

  async setQuantity(quantity) {
    await this.type(product.quantity, quantity);
  }

  async addToCart(expectedQuantity = '1') {
    await this.click(product.addToCart);
    await waitForVisible(this.driver, navigation.cartQuantity);
    await waitForText(this.driver, navigation.cartQuantity, String(expectedQuantity));
  }
}

module.exports = ProductPage;
