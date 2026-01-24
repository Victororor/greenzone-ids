import { apiGet, apiPost } from "./api";

export function getAllPlaces() {
  return apiGet("/api/places");
}