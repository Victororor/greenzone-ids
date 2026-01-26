import { apiPost } from "./api";
import { apiGet } from "./api";

{
  /* Funzioni per l'autenticazione */
}
export function login(email, password) {
  return apiPost("/api/auth/login", { email, password });
}

export function register(email, password, nome, cognome) {
  return apiPost("/api/auth/signup", { email, password, nome, cognome });
}

export function logout(idToken) {
  return apiPost(
    "/api/auth/logout",
    {},
    {
      Authorization: `Bearer ${idToken}`,
    },
  );
}

export function refresh(refreshToken) {
  return apiPost("/api/auth/refresh", { refreshToken });
}
