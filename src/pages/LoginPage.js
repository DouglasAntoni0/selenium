const BasePage = require('./BasePage');
const auth = require('../locators/auth.locators');
const navigation = require('../locators/navigation.locators');
const { waitForUrlContains, waitForVisible } = require('../utils/waits');

class LoginPage extends BasePage {
  async openLogin() {
    await this.open('/auth/login');
    await waitForVisible(this.driver, auth.form);
  }

  async submitCredentials(email, password) {
    await this.type(auth.email, email);
    await this.type(auth.password, password);
    await this.click(auth.submit);
  }

  async expectLoggedInCustomer() {
    await waitForUrlContains(this.driver, '/account');
    await waitForVisible(this.driver, navigation.accountMenu);
  }

  async loginErrorMessage() {
    return this.text(auth.error);
  }

  async submitEmptyForm() {
    await this.click(auth.submit);
  }
}

module.exports = LoginPage;
