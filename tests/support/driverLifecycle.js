const { buildDriver } = require('../../src/driver/driverFactory');

async function createDriver() {
  return buildDriver();
}

async function disposeDriver(driver) {
  if (!driver) return;
  await driver.quit();
}

module.exports = {
  createDriver,
  disposeDriver
};
