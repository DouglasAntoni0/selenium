const { By } = require('selenium-webdriver');
const { byDataTest } = require('./shared.locators');

module.exports = {
  login: {
    email: byDataTest('email'),
    password: byDataTest('password'),
    submit: byDataTest('login-submit'),
    proceedAuthenticated: byDataTest('proceed-2'),
    guestTab: By.css('a[href="#guest-tab"]'),
    guestEmail: byDataTest('guest-email'),
    guestFirstName: byDataTest('guest-first-name'),
    guestLastName: byDataTest('guest-last-name'),
    guestSubmit: byDataTest('guest-submit'),
    proceedGuest: byDataTest('proceed-2-guest')
  },
  address: {
    country: byDataTest('country'),
    postalCode: byDataTest('postal_code'),
    houseNumber: byDataTest('house_number'),
    street: byDataTest('street'),
    city: byDataTest('city'),
    state: byDataTest('state'),
    proceed: byDataTest('proceed-3')
  },
  payment: {
    method: byDataTest('payment-method'),
    bankName: byDataTest('bank_name'),
    accountName: byDataTest('account_name'),
    accountNumber: byDataTest('account_number'),
    creditCardNumber: byDataTest('credit_card_number'),
    expirationDate: byDataTest('expiration_date'),
    cvv: byDataTest('cvv'),
    cardHolderName: byDataTest('card_holder_name'),
    monthlyInstallments: byDataTest('monthly_installments'),
    finish: byDataTest('finish'),
    successMessage: byDataTest('payment-success-message'),
    errorMessage: byDataTest('payment-error-message'),
    confirmation: By.id('order-confirmation')
  }
};
