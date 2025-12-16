export const apiBaseUrl = "http://172.20.10.3:3000";

export async function apiPost(endpoint, body) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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


