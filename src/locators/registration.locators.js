const { byDataTest } = require('./shared.locators');

module.exports = {
  form: byDataTest('register-form'),
  firstName: byDataTest('first-name'),
  lastName: byDataTest('last-name'),
  dob: byDataTest('dob'),
  country: byDataTest('country'),
  postalCode: byDataTest('postal_code'),
  houseNumber: byDataTest('house_number'),
  street: byDataTest('street'),
  city: byDataTest('city'),
  state: byDataTest('state'),
  phone: byDataTest('phone'),
  email: byDataTest('email'),
  password: byDataTest('password'),
  submit: byDataTest('register-submit'),
  registerError: byDataTest('register-error'),
  errors: {
    firstName: byDataTest('first-name-error'),
    lastName: byDataTest('last-name-error'),
    dob: byDataTest('dob-error'),
    country: byDataTest('country-error'),
    postalCode: byDataTest('postal_code-error'),
    houseNumber: byDataTest('house_number-error'),
    street: byDataTest('street-error'),
    city: byDataTest('city-error'),
    state: byDataTest('state-error'),
    phone: byDataTest('phone-error'),
    email: byDataTest('email-error'),
    password: byDataTest('password-error')
  }
};
