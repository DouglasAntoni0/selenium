function parseMoney(value) {
  const normalized = String(value).replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Unable to parse money value: ${value}`);
  }

  return parsed;
}

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function formatCurrency(value) {
  return `$${roundCurrency(value).toFixed(2)}`;
}

module.exports = {
  parseMoney,
  roundCurrency,
  formatCurrency
};
