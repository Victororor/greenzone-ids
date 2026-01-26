import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiBaseUrl = "http://192.168.3.247:3000";

{
  /* Funzione helper per ottenere gli header comuni */
}
async function getCommonHeaders(customHeaders = {}) {
  const token = await AsyncStorage.getItem("idToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}
{
  /* Funzioni per le chiamate API */
  /* Queste funzioni gestiscono le richieste HTTP di tipo POST, GET, DELETE e PUT */
}
export async function apiPost(endpoint, body = {}, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers);

  const response = await fetch(url, {
    method: "POST",
    headers: allHeaders,
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

export async function apiGet(endpoint, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers);

  const response = await fetch(url, {
    method: "GET",
    headers: allHeaders,
  });

  return handleResponse(response);
}

export async function apiDelete(endpoint, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers);

  const response = await fetch(url, {
    method: "DELETE",
    headers: allHeaders,
  });

  return handleResponse(response);
}

export async function apiPut(endpoint, body = {}, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers);

  const response = await fetch(url, {
    method: "PUT",
    headers: allHeaders,
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

{
  /* Funzione helper per gestire la risposta */
}
async function handleResponse(response) {
  const text = await response.text();
  let result = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    throw new Error(result?.message || `API Error: ${response.status}`);
  }

  return result;
}
