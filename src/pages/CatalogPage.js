const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const catalog = require('../locators/catalog.locators');
const { parseMoney } = require('../utils/money');
const { waitForCondition, waitForVisible } = require('../utils/waits');

const isSortedAscending = (values) => values.every((value, index, list) => index === 0 || list[index - 1] <= value);

class CatalogPage extends BasePage {
  async openHome() {
    await this.open('/');
    await waitForVisible(this.driver, catalog.searchInput);
  }

  async searchFor(query) {
    await this.type(catalog.searchInput, query);
    await this.click(catalog.searchSubmit);
    await waitForVisible(this.driver, catalog.searchCaption);
    await waitForCondition(this.driver, `Search results did not settle for query "${query}"`, async () => {
      const products = await this.driver.findElements(catalog.productName);
      const noResults = await this.driver.findElements(catalog.noResults);
      return products.length > 0 || noResults.length > 0;
    });
  }

  async resetSearch() {
    await this.click(catalog.searchReset);
    await waitForVisible(this.driver, catalog.searchInput);
  }

  async sortBy(value) {
    await this.selectByValue(catalog.sort, value);

    if (value === 'price,asc') {
      await waitForCondition(this.driver, `Product list did not sort by ${value}`, async () => {
        const prices = await this.visibleProductPrices();
        return prices.length > 1 && isSortedAscending(prices);
      });
      return;
    }

    await waitForCondition(this.driver, `Product list did not update after sorting by ${value}`, async () => {
      const cards = await this.driver.findElements(catalog.productCards);
      return cards.length > 0;
    });
  }

  async visibleProductNames() {
    return this.driver.executeScript(() => {
      return Array.from(document.querySelectorAll('[data-test="product-name"]'))
        .filter((element) => element.offsetParent !== null)
        .map((element) => element.textContent.trim())
        .filter(Boolean);
    });
  }

  async visibleProductPrices() {
    const rawPrices = await this.driver.executeScript(() => {
      return Array.from(document.querySelectorAll('[data-test="product-price"]'))
        .filter((element) => element.offsetParent !== null)
        .map((element) => element.textContent.trim())
        .filter(Boolean);
    });

    return rawPrices.map(parseMoney);
  }

  async openProductById(productId) {
    await this.click(By.css(`[data-test="product-${productId}"]`));
    await waitForVisible(this.driver, require('../locators/product.locators').name);
  }
}

module.exports = CatalogPage;