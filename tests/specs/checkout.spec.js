const { expect } = require('chai');
const ProductPage = require('../../src/pages/ProductPage');
const CartPage = require('../../src/pages/CartPage');
const CheckoutPage = require('../../src/pages/CheckoutPage');
const checkout = require('../../src/locators/checkout.locators');
const { buildCustomer, buildGuest } = require('../../src/utils/testDataFactory');
const { findPurchasableProduct } = require('../../src/utils/catalogApi');
const { roundCurrency } = require('../../src/utils/money');
const { waitForVisible } = require('../../src/utils/waits');
const { createDriver, disposeDriver } = require('../support/driverLifecycle');
const env = require('../../src/config/environment');

describe('Checkout completo', function () {
  this.retries(env.retryAttempts);

  let driver;
  let productPage;
  let cartPage;
  let checkoutPage;

  beforeEach(async () => {
    driver = await createDriver();
    productPage = new ProductPage(driver);
    cartPage = new CartPage(driver);
    checkoutPage = new CheckoutPage(driver);
  });

  afterEach(async () => {
    await disposeDriver(driver);
  });

  it('conclui checkout como convidado com validacao de total', async () => {
    const product = await findPurchasableProduct('Hammer');
    const guest = buildGuest();
    const address = buildCustomer();

    await productPage.openProduct(product.id);
    const unitPrice = await productPage.unitPrice();
    await productPage.setQuantity(2);
    await productPage.addToCart(2);
    await cartPage.openFromNavigation();

    expect(roundCurrency(await cartPage.total())).to.equal(roundCurrency(unitPrice * 2));

    await cartPage.proceedToCheckoutLogin();
    await checkoutPage.continueAsGuest(guest);
    await checkoutPage.fillAddress(address);
    await checkoutPage.choosePaymentMethod('cash-on-delivery');
    await checkoutPage.finishOrder();

    expect(await checkoutPage.orderConfirmationText()).to.contain('Thanks for your order');
  });

  it('bloqueia finalizacao quando transferencia bancaria esta incompleta', async () => {
    const product = await findPurchasableProduct('Hammer');
    const guest = buildGuest();
    const address = buildCustomer();

    await productPage.openProduct(product.id);
    await productPage.addToCart(1);
    await cartPage.openFromNavigation();
    await cartPage.proceedToCheckoutLogin();
    await checkoutPage.continueAsGuest(guest);
    await checkoutPage.fillAddress(address);
    await checkoutPage.choosePaymentMethod('bank-transfer');

    await waitForVisible(driver, checkout.payment.bankName);

    expect(await checkoutPage.isFinishEnabled()).to.equal(false);
  });
});
