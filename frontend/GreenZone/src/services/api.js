import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiBaseUrl = "http://192.168.3.247:3000";

// Funzione helper per recuperare il token e preparare gli header standard
async function getCommonHeaders(customHeaders = {}) {
  const token = await AsyncStorage.getItem("idToken");
  
  return {
    "Content-Type": "application/json",
    // Se il token c'è, lo aggiunge. Se non c'è, non mette nulla.
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };
}

export async function apiPost(endpoint, body = {}, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers); // Recupera token qui

  const response = await fetch(url, {
    method: "POST",
    headers: allHeaders,
    body: JSON.stringify(body),
  });

  return handleResponse(response);
}

export async function apiGet(endpoint, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers); // Recupera token qui

  const response = await fetch(url, {
    method: "GET",
    headers: allHeaders,
  });

  return handleResponse(response);
}

export async function apiDelete(endpoint, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers); // Recupera token qui

  const response = await fetch(url, {
    method: "DELETE",
    headers: allHeaders,
  });
  
  return handleResponse(response);
}

export async function apiPut(endpoint, body = {}, headers = {}) {
  const url = `${apiBaseUrl}${endpoint}`;
  const allHeaders = await getCommonHeaders(headers); // Recupera token qui

  const response = await fetch(url, {
    method: "PUT",
    headers: allHeaders,
    body: JSON.stringify(body),
  });
  
  return handleResponse(response);
}

// Funzione helper per gestire la risposta e gli errori (per evitare codice duplicato)
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