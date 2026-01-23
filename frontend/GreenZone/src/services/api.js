export const apiBaseUrl = "http://192.168.3.122:3000";

export async function apiPost(endpoint, body = {}, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let result = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    throw new Error(result?.message || "API request failed");
  }

  return result;
}

export async function apiGet(endpoint, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...headers },
  });

  const text = await response.text();
  let result = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    throw new Error(result?.message || "API GET failed");
  }

  return result;
}

