async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const rawBody = await response.text();
  const body = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    const message = body?.message || body?.error || rawBody || response.statusText;
    throw new Error(`HTTP ${response.status} for ${url}: ${message}`);
  }

  return body;
}

module.exports = {
  requestJson
};
