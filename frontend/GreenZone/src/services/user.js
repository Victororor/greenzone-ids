import { apiGet, apiDelete, apiPut } from "./api";

{
  /* Funzioni per la gestione degli utenti */
}
export function getAllUsers() {
  return apiGet("/api/users");
}

export function deleteUser(userId) {
  return apiDelete(`/api/users/${userId}`);
}
