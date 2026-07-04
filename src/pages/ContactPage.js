const BasePage = require('./BasePage');
const contact = require('../locators/contact.locators');
const { alerts } = require('../locators/shared.locators');
const { waitForVisible } = require('../utils/waits');

class ContactPage extends BasePage {
  async openContact() {
    await this.open('/contact');
    await waitForVisible(this.driver, contact.firstName);
  }

  async fillContactMessage(message) {
    await this.typeAndBlur(contact.firstName, message.firstName);
    await this.typeAndBlur(contact.lastName, message.lastName);
    await this.typeAndBlur(contact.email, message.email);
    await this.selectByValue(contact.subject, message.subject);
    await this.typeAndBlur(contact.message, message.message);
  }

  async submit() {
    await this.click(contact.submit);
  }

  async send(message) {
    await this.fillContactMessage(message);
    await this.submit();
  }

  async successMessage() {
    return this.text(alerts.success);
  }
}

module.exports = ContactPage;
