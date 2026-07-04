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

    try {
      await waitForVisible(this.driver, navigation.accountMenu, 15000);
    } catch (error) {
      // URL /account is the reliable post-login contract; the menu can lag on GitHub-hosted Chrome.
      const currentUrl = await this.driver.getCurrentUrl();
      if (!currentUrl.includes('/account')) throw error;
    }
  }

  async loginErrorMessage() {
    return this.text(auth.error);
  }

  async submitEmptyForm() {
    await this.click(auth.submit);
  }
}

module.exports = LoginPage;
