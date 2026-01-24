import { apiGet, apiPost } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function createPlaceSuggestion(suggestionData) {
  const idToken = await AsyncStorage.getItem("idToken");
  return apiPost("/api/placeSuggestion", suggestionData, {
    Authorization: `Bearer ${idToken}`,
  });
}

export async function getSuggestionsPending() {
  const idToken = await AsyncStorage.getItem("idToken");
  return apiGet("/api/placeSuggestion", {
    Authorization: `Bearer ${idToken}`,
  });
}

export async function approveSuggestion(id) {
  const idToken = await AsyncStorage.getItem("idToken");
  return apiPost(`/api/placeSuggestion/${id}/approve`, {}, {
    Authorization: `Bearer ${idToken}`,
  });
}

export async function rejectSuggestion(id) {
  const idToken = await AsyncStorage.getItem("idToken");
  return apiPost(`/api/placeSuggestion/${id}/reject`, {}, {
    Authorization: `Bearer ${idToken}`,
  });
}
