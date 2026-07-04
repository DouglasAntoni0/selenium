const BasePage = require('./BasePage');
const checkout = require('../locators/checkout.locators');
const { waitForCondition, waitForVisible } = require('../utils/waits');

class CheckoutPage extends BasePage {
  async continueAsGuest(guest) {
    await waitForVisible(this.driver, checkout.login.guestTab);
    await this.click(checkout.login.guestTab);
    await waitForVisible(this.driver, checkout.login.guestEmail);
    await this.typeAndBlur(checkout.login.guestEmail, guest.email);
    await this.typeAndBlur(checkout.login.guestFirstName, guest.firstName);
    await this.typeAndBlur(checkout.login.guestLastName, guest.lastName);
    await this.click(checkout.login.guestSubmit);
    await this.click(checkout.login.proceedGuest);
  }

  async fillAddress(address) {
    await waitForVisible(this.driver, checkout.address.country);
    await this.selectByValue(checkout.address.country, address.country);
    await this.typeAndBlur(checkout.address.postalCode, address.postalCode);
    await this.typeAndBlur(checkout.address.houseNumber, address.houseNumber);
    await this.typeAndBlur(checkout.address.street, address.street);
    await this.typeAndBlur(checkout.address.city, address.city);
    await this.typeAndBlur(checkout.address.state, address.state);
    await this.click(checkout.address.proceed);
  }

  async choosePaymentMethod(value) {
    await waitForVisible(this.driver, checkout.payment.method);
    await this.selectByValue(checkout.payment.method, value);
  }

  async fillBankTransfer(details) {
    await this.choosePaymentMethod('bank-transfer');
    await this.typeAndBlur(checkout.payment.bankName, details.bankName);
    await this.typeAndBlur(checkout.payment.accountName, details.accountName);
    await this.typeAndBlur(checkout.payment.accountNumber, details.accountNumber);
  }

  async finishOrder() {
    // The payment component first validates the payment method and then, after
    // that state is warm, a second click creates the invoice. We model both
    // state transitions explicitly to avoid arbitrary sleeps or double orders.
    await this.click(checkout.payment.finish);

    await waitForCondition(this.driver, 'Payment validation did not complete', async () => {
      const confirmation = await this.isDisplayed(checkout.payment.confirmation);
      const success = await this.isDisplayed(checkout.payment.successMessage);
      const error = await this.isDisplayed(checkout.payment.errorMessage);
      return confirmation || success || error;
    }, 60000);

    if (await this.isDisplayed(checkout.payment.errorMessage)) {
      throw new Error(await this.text(checkout.payment.errorMessage));
    }

    if (await this.isDisplayed(checkout.payment.confirmation)) return;

    await this.click(checkout.payment.finish);

    await waitForCondition(this.driver, 'Invoice confirmation did not appear', async () => {
      const confirmation = await this.isDisplayed(checkout.payment.confirmation);
      const error = await this.isDisplayed(checkout.payment.errorMessage);
      return confirmation || error;
    }, 90000);

    if (await this.isDisplayed(checkout.payment.errorMessage)) {
      throw new Error(await this.text(checkout.payment.errorMessage));
    }
  }

  async isFinishEnabled() {
    return this.isEnabled(checkout.payment.finish);
  }

  async orderConfirmationText() {
    return this.text(checkout.payment.confirmation);
  }
}

module.exports = CheckoutPage;