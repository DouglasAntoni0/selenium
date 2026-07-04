const { expect } = require('chai');
const CatalogPage = require('../../src/pages/CatalogPage');
const catalog = require('../../src/locators/catalog.locators');
const { waitForVisible } = require('../../src/utils/waits');
const { createDriver, disposeDriver } = require('../support/driverLifecycle');
const env = require('../../src/config/environment');

describe('Catalogo e busca de produtos', function () {
  this.retries(env.retryAttempts);

  let driver;
  let catalogPage;

  beforeEach(async () => {
    driver = await createDriver();
    catalogPage = new CatalogPage(driver);
  });

  afterEach(async () => {
    await disposeDriver(driver);
  });

  it('busca produtos por termo e lista resultados coerentes', async () => {
    await catalogPage.openHome();
    await catalogPage.searchFor('Hammer');

    const names = await catalogPage.visibleProductNames();

    expect(await catalogPage.text(catalog.searchTerm)).to.equal('Hammer');
    expect(names.length).to.be.greaterThan(0);
    expect(names.some((name) => name.toLowerCase().includes('hammer'))).to.equal(true);
  });

  it('exibe estado vazio para busca sem correspondencia', async () => {
    await catalogPage.openHome();
    await catalogPage.searchFor('sem-resultado-qa-999999');

    expect(await waitForVisible(driver, catalog.noResults)).to.exist;
  });

  it('ordena produtos por menor preco visivel', async () => {
    await catalogPage.openHome();
    await catalogPage.sortBy('price,asc');

    const prices = await catalogPage.visibleProductPrices();
    const sortedPrices = [...prices].sort((left, right) => left - right);

    expect(prices.length).to.be.greaterThan(1);
    expect(prices).to.deep.equal(sortedPrices);
  });
});
