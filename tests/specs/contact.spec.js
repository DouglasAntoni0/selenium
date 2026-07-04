const { expect } = require('chai');
const ContactPage = require('../../src/pages/ContactPage');
const contact = require('../../src/locators/contact.locators');
const { buildContact } = require('../../src/utils/testDataFactory');
const { waitForVisible } = require('../../src/utils/waits');
const { createDriver, disposeDriver } = require('../support/driverLifecycle');
const env = require('../../src/config/environment');

describe('Formulario de contato', function () {
  this.retries(env.retryAttempts);

  let driver;
  let contactPage;

  beforeEach(async () => {
    driver = await createDriver();
    contactPage = new ContactPage(driver);
  });

  afterEach(async () => {
    await disposeDriver(driver);
  });

  it('envia mensagem de contato com dados dinamicos', async () => {
    const message = buildContact();

    await contactPage.openContact();
    await contactPage.send(message);

    expect(await contactPage.successMessage()).to.contain('Thanks for your message');
  });

  it('exibe erros para formulario obrigatorio vazio', async () => {
    await contactPage.openContact();
    await contactPage.submit();

    expect(await waitForVisible(driver, contact.errors.firstName)).to.exist;
    expect(await waitForVisible(driver, contact.errors.email)).to.exist;
    expect(await waitForVisible(driver, contact.errors.subject)).to.exist;
    expect(await waitForVisible(driver, contact.errors.message)).to.exist;
  });
});
