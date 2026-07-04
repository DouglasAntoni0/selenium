const { byDataTest } = require('./shared.locators');

module.exports = {
  firstName: byDataTest('first-name'),
  lastName: byDataTest('last-name'),
  email: byDataTest('email'),
  subject: byDataTest('subject'),
  message: byDataTest('message'),
  attachment: byDataTest('attachment'),
  submit: byDataTest('contact-submit'),
  errors: {
    firstName: byDataTest('first-name-error'),
    lastName: byDataTest('last-name-error'),
    email: byDataTest('email-error'),
    subject: byDataTest('subject-error'),
    message: byDataTest('message-error'),
    attachment: byDataTest('attachment-error')
  }
};
