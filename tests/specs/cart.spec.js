const { expect } = require('chai');
const ProductPage = require('../../src/pages/ProductPage');
const CartPage = require('../../src/pages/CartPage');
const { roundCurrency } = require('../../src/utils/money');
const { findPurchasableProduct } = require('../../src/utils/catalogApi');
const { createDriver, disposeDriver } = require('../support/driverLifecycle');
const env = require('../../src/config/environment');

describe('Carrinho de compras', function () {
  this.retries(env.retryAttempts);

  let driver;
  let productPage;
  let cartPage;

  beforeEach(async () => {
    driver = await createDriver();
    productPage = new ProductPage(driver);
    cartPage = new CartPage(driver);
  });

  afterEach(async () => {
    await disposeDriver(driver);
  });

  it('adiciona produto ao carrinho e valida valor por linha', async () => {
    const product = await findPurchasableProduct('Hammer');

    await productPage.openProduct(product.id);
    const unitPrice = await productPage.unitPrice();
    await productPage.setQuantity(2);
    await productPage.addToCart(2);
    await cartPage.openFromNavigation();

    expect(await cartPage.productTitle()).to.equal(product.name);
    expect(await cartPage.quantity()).to.equal(2);
    expect(roundCurrency(await cartPage.linePrice())).to.equal(roundCurrency(unitPrice * 2));
  });

  it('atualiza quantidade e recalcula total do carrinho', async () => {
    const product = await findPurchasableProduct('Hammer');

    await productPage.openProduct(product.id);
    const unitPrice = await productPage.unitPrice();
    await productPage.addToCart(1);
    await cartPage.openFromNavigation();
    await cartPage.updateQuantity(3);

    expect(await cartPage.quantity()).to.equal(3);
    expect(roundCurrency(await cartPage.total())).to.equal(roundCurrency(unitPrice * 3));
  });

  it('remove produto e deixa o carrinho vazio', async () => {
    const product = await findPurchasableProduct('Hammer');

    await productPage.openProduct(product.id);
    await productPage.addToCart(1);
    await cartPage.openFromNavigation();
    await cartPage.removeFirstItem();

    expect(await cartPage.isDisplayed(require('../../src/locators/cart.locators').emptyCartMessage)).to.equal(true);
  });
});
