import { apiGet, apiDelete, apiPut } from "./api";

// Ottieni la lista di tutti gli utenti
export function getAllUsers() {
  return apiGet("/api/users");
}

// Elimina un utente specifico tramite ID (uid)
export function deleteUser(userId) {
  return apiDelete(`/api/users/${userId}`);
}

// (Opzionale) Se in futuro vorrai cambiare ruolo o dati utente
export function updateUser(userId, data) {
  return apiPut(`/api/users/${userId}`, data);
}