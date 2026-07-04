const { expect } = require('chai');
const LoginPage = require('../../src/pages/LoginPage');
const RegistrationPage = require('../../src/pages/RegistrationPage');
const auth = require('../../src/locators/auth.locators');
const registration = require('../../src/locators/registration.locators');
const { waitForVisible } = require('../../src/utils/waits');
const { buildCustomer } = require('../../src/utils/testDataFactory');
const { registerCustomer } = require('../../src/utils/userApi');
const { createDriver, disposeDriver } = require('../support/driverLifecycle');
const env = require('../../src/config/environment');

describe('Autenticacao e cadastro de clientes', function () {
  this.retries(env.retryAttempts);

  let driver;
  let loginPage;
  let registrationPage;

  beforeEach(async () => {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    registrationPage = new RegistrationPage(driver);
  });

  afterEach(async () => {
    await disposeDriver(driver);
  });

  it('cadastra um novo cliente pela UI e redireciona para login', async () => {
    const customer = buildCustomer();

    await registrationPage.openRegistration();
    await registrationPage.register(customer);
    await registrationPage.expectRedirectedToLogin();
  });

  it('autentica com sucesso um cliente dinamico preparado pela API', async () => {
    const customer = buildCustomer();
    await registerCustomer(customer);

    await loginPage.openLogin();
    await loginPage.submitCredentials(customer.email, customer.password);
    await loginPage.expectLoggedInCustomer();
  });

  it('rejeita login com senha incorreta', async () => {
    const customer = buildCustomer();
    await registerCustomer(customer);

    await loginPage.openLogin();
    await loginPage.submitCredentials(customer.email, 'SenhaErrada!123');

    expect(await loginPage.loginErrorMessage()).to.contain('Invalid email or password');
  });

  it('valida campos obrigatorios no login', async () => {
    await loginPage.openLogin();
    await loginPage.submitEmptyForm();

    expect(await waitForVisible(driver, auth.emailError)).to.exist;
    expect(await waitForVisible(driver, auth.passwordError)).to.exist;
  });

  it('exibe validacoes obrigatorias no cadastro vazio', async () => {
    await registrationPage.openRegistration();
    await registrationPage.submit();

    expect(await waitForVisible(driver, registration.errors.firstName)).to.exist;
    expect(await waitForVisible(driver, registration.errors.lastName)).to.exist;
    expect(await waitForVisible(driver, registration.errors.email)).to.exist;
    expect(await waitForVisible(driver, registration.errors.password)).to.exist;
  });
});
