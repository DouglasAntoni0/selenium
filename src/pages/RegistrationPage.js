const BasePage = require('./BasePage');
const registration = require('../locators/registration.locators');
const { waitForUrlContains, waitForVisible } = require('../utils/waits');

class RegistrationPage extends BasePage {
  async openRegistration() {
    await this.open('/auth/register');
    await waitForVisible(this.driver, registration.form);
  }

  async fillCustomer(customer) {
    await this.typeAndBlur(registration.firstName, customer.firstName);
    await this.typeAndBlur(registration.lastName, customer.lastName);
    await this.typeAndBlur(registration.dob, customer.dateOfBirth);
    await this.selectByValue(registration.country, customer.country);
    await this.typeAndBlur(registration.postalCode, customer.postalCode);
    await this.typeAndBlur(registration.houseNumber, customer.houseNumber);
    await this.typeAndBlur(registration.street, customer.street);
    await this.typeAndBlur(registration.city, customer.city);
    await this.typeAndBlur(registration.state, customer.state);
    await this.typeAndBlur(registration.phone, customer.phone);
    await this.typeAndBlur(registration.email, customer.email);
    await this.typeAndBlur(registration.password, customer.password);
  }

  async submit() {
    await this.click(registration.submit);
  }

  async register(customer) {
    await this.fillCustomer(customer);
    await this.submit();
  }

  async expectRedirectedToLogin() {
    await waitForUrlContains(this.driver, '/auth/login');
  }
}

module.exports = RegistrationPage;
