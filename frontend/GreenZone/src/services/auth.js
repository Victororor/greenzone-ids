import { apiPost } from "./api";

export function login(email, password) {
  return apiPost("/api/auth/login", { email, password });
}

export function register(email, password, nome, cognome) {
  return apiPost("/api/auth/signup", { email, password, nome, cognome });
}
