const { byDataTest } = require('./shared.locators');

module.exports = {
  form: byDataTest('login-form'),
  email: byDataTest('email'),
  password: byDataTest('password'),
  submit: byDataTest('login-submit'),
  registerLink: byDataTest('register-link'),
  error: byDataTest('login-error'),
  emailError: byDataTest('email-error'),
  passwordError: byDataTest('password-error'),
  totpCode: byDataTest('totp-code')
};
