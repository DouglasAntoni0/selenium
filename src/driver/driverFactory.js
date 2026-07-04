const fs = require('fs');
const os = require('os');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');
const { Builder } = require('selenium-webdriver');
const env = require('../config/environment');

const chromeUserAgent = process.env.CHROME_USER_AGENT
  || 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36';

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

function resolveChromeDriverBinary() {
  if (process.env.CHROMEDRIVER_BINARY) return process.env.CHROMEDRIVER_BINARY;
  if (shouldUsePackagedChromeDriver()) return require('chromedriver').path;
  return null;
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

  options.excludeSwitches('enable-automation');
  options.setUserPreferences({
    credentials_enable_service: false,
    profile: {
      password_manager_enabled: false
    }
  });

  options.addArguments(
    `--user-data-dir=${chromeProfile}`,
    '--window-size=1440,1100',
    '--remote-debugging-port=0',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--disable-software-rasterizer',
    '--disable-extensions',
    '--disable-blink-features=AutomationControlled',
    '--disable-background-networking',
    '--disable-notifications',
    '--disable-popup-blocking',
    '--lang=en-US',
    '--use-gl=swiftshader',
    `--user-agent=${chromeUserAgent}`,
    '--no-sandbox',
    '--remote-allow-origins=*'
  );

  return options;
}

async function configureBrowserFingerprint(driver) {
  if (typeof driver.sendDevToolsCommand !== 'function') return;

  await driver.sendDevToolsCommand('Page.addScriptToEvaluateOnNewDocument', {
    source: "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });"
  });
}

async function buildDriver() {
  const builder = new Builder()
    .forBrowser(env.browser)
    .setChromeOptions(buildChromeOptions());
  const chromeDriverBinary = resolveChromeDriverBinary();

  if (chromeDriverBinary) {
    builder.setChromeService(new chrome.ServiceBuilder(chromeDriverBinary));
  }

  const driver = await builder.build();
  await configureBrowserFingerprint(driver);

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