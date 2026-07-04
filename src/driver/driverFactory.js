const fs = require('fs');
const os = require('os');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const { Builder } = require('selenium-webdriver');
const env = require('../config/environment');

const commonChromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
];

function resolveChromeBinary() {
  if (process.env.CHROME_BINARY) return process.env.CHROME_BINARY;
  return commonChromePaths.find((candidate) => fs.existsSync(candidate));
}

function shouldUsePackagedChromeDriver() {
  if (process.env.USE_PACKAGED_CHROMEDRIVER != null) {
    return ['1', 'true', 'yes'].includes(String(process.env.USE_PACKAGED_CHROMEDRIVER).toLowerCase());
  }

  return !process.env.CI;
}

function buildChromeOptions() {
  const options = new chrome.Options();
  const chromeBinary = resolveChromeBinary();
  const chromeProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'selenium-chrome-profile-'));

  if (chromeBinary) {
    options.setChromeBinaryPath(chromeBinary);
  }

  if (env.headless) {
    options.addArguments('--headless=new');
  }

  options.addArguments(
    `--user-data-dir=${chromeProfile}`,
    '--window-size=1440,1100',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-notifications',
    '--disable-popup-blocking',
    '--lang=en-US',
    '--no-sandbox',
    '--remote-allow-origins=*'
  );

  return options;
}

async function buildDriver() {
  const builder = new Builder()
    .forBrowser(env.browser)
    .setChromeOptions(buildChromeOptions());

  if (shouldUsePackagedChromeDriver()) {
    builder.setChromeService(new chrome.ServiceBuilder(require('chromedriver').path));
  }

  const driver = await builder.build();

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: env.pageLoadTimeout,
    script: 30000
  });

  return driver;
}

module.exports = {
  buildDriver
};