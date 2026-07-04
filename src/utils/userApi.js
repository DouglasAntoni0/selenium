const env = require('../config/environment');
const { requestJson } = require('./httpClient');

async function registerCustomer(customer) {
  return requestJson(`${env.apiUrl}/users/register`, {
    method: 'POST',
    body: JSON.stringify({
      first_name: customer.firstName,
      last_name: customer.lastName,
      dob: customer.dateOfBirth,
      phone: customer.phone,
      email: customer.email,
      password: customer.password,
      address: {
        street: customer.street,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postal_code: customer.postalCode
      }
    })
  });
}

module.exports = {
  registerCustomer
};
