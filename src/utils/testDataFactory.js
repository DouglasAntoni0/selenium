const { faker } = require('@faker-js/faker');

function uniqueEmail(prefix = 'qa') {
  const safePrefix = String(prefix).replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 10) || 'qa';
  const timestamp = Date.now().toString(36);
  const nonce = faker.string.alphanumeric(8).toLowerCase();
  return `${safePrefix}.${timestamp}.${nonce}@example.com`;
}

function buildCustomer(overrides = {}) {
  const firstName = faker.person.firstName().replace(/[^A-Za-z]/g, '') || 'Taylor';
  const lastName = faker.person.lastName().replace(/[^A-Za-z]/g, '') || 'Morgan';

  return {
    firstName,
    lastName,
    dateOfBirth: '1990-04-12',
    country: 'BR',
    postalCode: faker.location.zipCode('#####-###').replace(/\D/g, '').padEnd(8, '0').slice(0, 8),
    houseNumber: String(faker.number.int({ min: 10, max: 999 })),
    street: faker.location.streetAddress(false),
    city: faker.location.city(),
    state: faker.location.state(),
    phone: faker.string.numeric({ length: 11, allowLeadingZeros: false }),
    email: uniqueEmail(),
    password: `Qa!${faker.string.alphanumeric(10)}7`,
    ...overrides
  };
}

function buildContact(overrides = {}) {
  return {
    firstName: faker.person.firstName().replace(/[^A-Za-z]/g, '') || 'Alex',
    lastName: faker.person.lastName().replace(/[^A-Za-z]/g, '') || 'Rivera',
    email: uniqueEmail('contact'),
    subject: 'customer-service',
    message: `Automated QA message ${faker.string.uuid()} with enough detail for validation.`,
    ...overrides
  };
}

function buildGuest(overrides = {}) {
  const customer = buildCustomer();
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: uniqueEmail('guest'),
    ...overrides
  };
}

module.exports = {
  buildCustomer,
  buildContact,
  buildGuest,
  uniqueEmail
};