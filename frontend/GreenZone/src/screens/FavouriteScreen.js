import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";
import { apiGet } from "../services/api";

const CATEGORY_LABELS = {
  restaurant: "Ristorante",
  shop: "Negozio",
  farm: "Fattoria",
  market: "Mercato",
  cafe: "Caffetteria",
  bakery: "Panificio",
  other: "Altro",
};

export default function FavouriteScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadFavorites() {
    try {
      const idToken = await AsyncStorage.getItem("idToken");

      const res = await apiGet("/api/favorites/me", {
        Authorization: `Bearer ${idToken}`,
      });

      setFavorites(res.data.favorites || []);
    } catch (e) {
      console.log("ERR PREFERITI:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: "100%" }}>
        <Text style={styles.title}>Preferiti</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#14948B" />
          </View>
        ) : (
          <ScrollView style={{ paddingHorizontal: 20 }}>
            {favorites.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#6B7280", marginTop: 30 }}>
                Nessun luogo nei preferiti
              </Text>
            ) : (
              favorites.map((fav) => (
                <Pressable key={fav.id} style={styles.card}>
                  <Text style={styles.placeName}>{fav.name}</Text>
                  <Text style={styles.category}>
                    {CATEGORY_LABELS[fav.category] || fav.category}
                  </Text>
                  <Text style={styles.location}>
                    {fav.location?.address ? `${fav.location.address}, ` : ""}
                    {fav.location?.city || ""}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 50,
    paddingBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  category: {
    fontSize: 14,
    color: "#14948B",
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});
