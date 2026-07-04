const { Key } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const env = require('../config/environment');
const {
  waitForAppReady,
  waitForClickable,
  waitForEnabled,
  waitForVisible
} = require('../utils/waits');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(path = '/') {
    const target = new URL(path, env.baseUrl).toString();
    await this.driver.get(target);
    await waitForAppReady(this.driver);
  }

  async find(locator) {
    return waitForVisible(this.driver, locator);
  }

  async click(locator) {
    const element = await waitForClickable(this.driver, locator);
    await element.click();
  }

  async type(locator, value) {
    const element = await waitForEnabled(this.driver, locator);
    await element.sendKeys(Key.chord(Key.CONTROL, 'a'), String(value));
  }

  async typeAndBlur(locator, value) {
    const element = await waitForEnabled(this.driver, locator);
    await element.sendKeys(Key.chord(Key.CONTROL, 'a'), String(value), Key.TAB);
  }

  async selectByValue(locator, value) {
    const element = await waitForEnabled(this.driver, locator);
    const select = new Select(element);
    await select.selectByValue(value);
  }

  async text(locator) {
    const element = await waitForVisible(this.driver, locator);
    return element.getText();
  }

  async value(locator) {
    const element = await waitForVisible(this.driver, locator);
    return element.getAttribute('value');
  }

  async isEnabled(locator) {
    const element = await waitForVisible(this.driver, locator);
    return element.isEnabled();
  }

  async isDisplayed(locator) {
    const elements = await this.driver.findElements(locator);
    if (!elements.length) return false;
    return elements[0].isDisplayed();
  }
}

module.exports = BasePage;
