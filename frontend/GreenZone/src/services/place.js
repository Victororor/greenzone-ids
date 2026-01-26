import { apiGet, apiPut, apiDelete } from "./api";

{
  /* Funzioni per la gestione dei luoghi */
}
export function getAllPlaces() {
  return apiGet("/api/places");
}

export async function updatePlace(id, data) {
  return apiPut(`/api/places/${id}`, data);
}

export async function deletePlace(id) {
  return apiDelete(`/api/places/${id}`);
}
