import { apiGet, apiPost, apiDelete } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function addToFavorite(placeId) {
  const idToken = await AsyncStorage.getItem("idToken");

  await apiPost(`/api/favorites/${placeId}`, {}, {
    Authorization: `Bearer ${idToken}`
  });
}

async function removeFavorite(placeId) {
  const idToken = await AsyncStorage.getItem("idToken");

  await apiDelete(`/api/favorites/${placeId}`, {
    Authorization: `Bearer ${idToken}`
  });
}

async function getFavorites() {
  const idToken = await AsyncStorage.getItem("idToken");

  const res = await apiGet(`/api/favorites`, {
    Authorization: `Bearer ${idToken}`
  });

  return res.data.favorites;
}