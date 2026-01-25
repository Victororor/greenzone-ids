import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// USIAMO L'IMPORT STANDARD (Più stabile)
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";

import BottomBar from "../components/BottomBar";
import { apiGet, apiDelete } from "../services/api";

import styles from "../styles/FavoriteStyle";

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

  // Riferimenti per chiudere gli swipe aperti se ne apri un altro
  let row = [];
  let prevOpenedRow;

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

  async function handleDelete(id) {
    try {
      const idToken = await AsyncStorage.getItem("idToken");
      
      await apiDelete(`/api/favorites/${id}`, {
        Authorization: `Bearer ${idToken}`
      });

      setFavorites((prev) => prev.filter((item) => item.id !== id));
      
    } catch (e) {
      console.log("Errore rimozione:", e);
      Alert.alert("Errore", "Impossibile rimuovere il preferito.");
    }
  }

  const confirmDelete = (id) => {
    Alert.alert(
      "Rimuovi preferito",
      "Vuoi davvero rimuoverlo?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Sì, rimuovi", 
          style: "destructive", 
          onPress: () => handleDelete(id) 
        }
      ]
    );
  };

  const renderRightActions = (progress, dragX, id) => {
    return (
      <View style={styles.rightActionContainer}>
        <Pressable 
          style={styles.deleteButton} 
          onPress={() => {
             // Chiudiamo lo swipe prima di mostrare l'alert
             if (prevOpenedRow && prevOpenedRow !== row[id]) {
                prevOpenedRow.close();
             }
             confirmDelete(id);
          }}
        >
          <Ionicons name="trash-outline" size={26} color="#fff" />
          <Text style={styles.deleteText}>Elimina</Text>
        </Pressable>
      </View>
    );
  };

  // Funzione per chiudere una riga quando ne apri un'altra
  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  return (
    // Assicurati che GestureHandlerRootView abbia flex: 1
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1, width: "100%" }}>
          <Text style={styles.title}>Preferiti</Text>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#14948B" />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              {favorites.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nessun luogo nei preferiti
                </Text>
              ) : (
                favorites.map((fav, index) => (
                  <View key={fav.id} style={styles.cardWrapper}>
                    <Swipeable
                      ref={(ref) => (row[index] = ref)}
                      onSwipeableOpen={() => closeRow(index)}
                      renderRightActions={(progress, dragX) => 
                        renderRightActions(progress, dragX, fav.id)
                      }
                      overshootRight={false} // Evita che il pulsante si "allunghi" troppo
                    >
                      <Pressable style={styles.card}>
                        <Text style={styles.placeName}>{fav.name}</Text>
                        <Text style={styles.category}>
                          {CATEGORY_LABELS[fav.category] || fav.category}
                        </Text>
                        <Text style={styles.location}>
                          {fav.location?.address ? `${fav.location.address}, ` : ""}
                          {fav.location?.city || ""}
                        </Text>
                      </Pressable>
                    </Swipeable>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>

        <BottomBar />
      </View>
    </GestureHandlerRootView>
  );
}
