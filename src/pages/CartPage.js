const { error, Key } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const cart = require('../locators/cart.locators');
const navigation = require('../locators/navigation.locators');
const { parseMoney, roundCurrency } = require('../utils/money');
const { waitForCondition, waitForVisible } = require('../utils/waits');

class CartPage extends BasePage {
  async openCart() {
    await this.open('/checkout');
    await waitForVisible(this.driver, cart.productTitle);
  }

  async openFromNavigation() {
    await this.click(navigation.cart);
    await waitForVisible(this.driver, cart.productTitle);
  }

  async productTitle() {
    return (await this.text(cart.productTitle)).trim();
  }

  async quantity() {
    return Number(await this.value(cart.quantity));
  }

  async productPrice() {
    return parseMoney(await this.text(cart.productPrice));
  }

  async linePrice() {
    return parseMoney(await this.text(cart.linePrice));
  }

  async total() {
    return parseMoney(await this.text(cart.total));
  }

  async updateQuantity(quantity) {
    const unitPrice = await this.productPrice();
    const input = await this.find(cart.quantity);

    await input.sendKeys(Key.chord(Key.CONTROL, 'a'), String(quantity), Key.TAB);

    await waitForCondition(this.driver, `Cart quantity did not become ${quantity}`, async () => {
      return Number(await this.value(cart.quantity)) === Number(quantity);
    });
    await waitForCondition(this.driver, 'Cart line price did not recalculate after quantity update', async () => {
      return roundCurrency(await this.linePrice()) === roundCurrency(unitPrice * Number(quantity));
    });
  }

  async removeFirstItem() {
    await this.click(cart.removeItem);
    await waitForCondition(this.driver, 'Cart item was not removed', async () => {
      const rows = await this.driver.findElements(cart.productTitle);
      if (!rows.length) return true;

      try {
        return !(await rows[0].isDisplayed());
      } catch (err) {
        if (err instanceof error.StaleElementReferenceError) return true;
        throw err;
      }
    });
  }

  async proceedToCheckoutLogin() {
    await this.click(cart.proceedToLogin);
  }
}

module.exports = CartPage;