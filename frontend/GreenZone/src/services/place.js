import { apiGet, apiPut, apiDelete } from "./api"; // Assumo tu abbia apiPut e apiDelete, altrimenti usa axios direttamente

export function getAllPlaces() {
  return apiGet("/api/places");
}

// Funzione per aggiornare un luogo (PUT)
export async function updatePlace(id, data) {
  // Se usi axios diretto: return axios.put(`/api/places/${id}`, data, header...);
  // Se hai un wrapper apiPut:
  return apiPut(`/api/places/${id}`, data);
}

// Funzione per eliminare un luogo (DELETE)
export async function deletePlace(id) {
  return apiDelete(`/api/places/${id}`); 
  // Oppure: return apiDelete(`/api/places/${id}/permanent`); a seconda della tua API
}