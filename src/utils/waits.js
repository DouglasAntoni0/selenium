const { until } = require('selenium-webdriver');
const env = require('../config/environment');

async function waitForLocated(driver, locator, timeout = env.defaultTimeout) {
  return driver.wait(until.elementLocated(locator), timeout, `Element was not located: ${locator}`);
}

async function waitForVisible(driver, locator, timeout = env.defaultTimeout) {
  const element = await waitForLocated(driver, locator, timeout);
  await driver.wait(until.elementIsVisible(element), timeout, `Element was not visible: ${locator}`);
  return element;
}

async function waitForEnabled(driver, locator, timeout = env.defaultTimeout) {
  const element = await waitForVisible(driver, locator, timeout);
  await driver.wait(until.elementIsEnabled(element), timeout, `Element was not enabled: ${locator}`);
  return element;
}

async function waitForClickable(driver, locator, timeout = env.defaultTimeout) {
  const element = await waitForEnabled(driver, locator, timeout);
  await driver.executeScript('arguments[0].scrollIntoView({ block: "center", inline: "nearest" });', element);
  return element;
}

async function waitForUrlContains(driver, fragment, timeout = env.defaultTimeout) {
  await driver.wait(until.urlContains(fragment), timeout, `URL did not contain: ${fragment}`);
}

async function waitForText(driver, locator, expectedText, timeout = env.defaultTimeout) {
  await driver.wait(async () => {
    const element = await waitForVisible(driver, locator, timeout);
    const text = await element.getText();
    return text.includes(expectedText);
  }, timeout, `Text "${expectedText}" was not found in ${locator}`);
}

async function waitForCondition(driver, description, predicate, timeout = env.defaultTimeout) {
  await driver.wait(predicate, timeout, description);
}

async function waitForAppReady(driver, timeout = env.defaultTimeout) {
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState;');
    return readyState === 'complete' || readyState === 'interactive';
  }, timeout, 'Document did not reach a usable ready state');
}

async function waitForElementCount(driver, locator, expectedCount, timeout = env.defaultTimeout) {
  await driver.wait(async () => {
    const elements = await driver.findElements(locator);
    return elements.length === expectedCount;
  }, timeout, `Expected ${expectedCount} elements for ${locator}`);
}

module.exports = {
  waitForLocated,
  waitForVisible,
  waitForEnabled,
  waitForClickable,
  waitForUrlContains,
  waitForText,
  waitForCondition,
  waitForAppReady,
  waitForElementCount
};
