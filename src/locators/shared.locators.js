const { By } = require('selenium-webdriver');

const byDataTest = (value) => By.css(`[data-test="${value}"]`);

module.exports = {
  byDataTest,
  alerts: {
    danger: By.css('.alert.alert-danger'),
    success: By.css('.alert.alert-success'),
    toast: By.css('#toast-container .ngx-toastr, .toast-success, .toast-error')
  }
};
