const numberFromEnv = (name, fallback, { allowZero = false } = {}) => {
  const parsed = Number(process.env[name]);
  const minimum = allowZero ? 0 : 1;
  return Number.isFinite(parsed) && parsed >= minimum ? parsed : fallback;
};

const booleanFromEnv = (name, fallback) => {
  if (process.env[name] == null) return fallback;
  return ['1', 'true', 'yes', 'y'].includes(String(process.env[name]).toLowerCase());
};

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
  apiUrl: process.env.API_URL || 'https://api.practicesoftwaretesting.com',
  browser: process.env.BROWSER || 'chrome',
  headless: booleanFromEnv('HEADLESS', true),
  defaultTimeout: numberFromEnv('UI_TIMEOUT_MS', 45000),
  pageLoadTimeout: numberFromEnv('PAGE_LOAD_TIMEOUT_MS', 90000),
  retryAttempts: numberFromEnv('RETRY_ATTEMPTS', 1, { allowZero: true }),
  defaultCustomer: {
    email: process.env.DEFAULT_CUSTOMER_EMAIL || 'customer@practicesoftwaretesting.com',
    password: process.env.DEFAULT_CUSTOMER_PASSWORD || 'welcome01'
  }
};
