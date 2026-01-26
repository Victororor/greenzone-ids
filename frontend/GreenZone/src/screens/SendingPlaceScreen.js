import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { apiPost } from "../services/api";
import styles from "../styles/SPSyles";

const CATEGORIES = [
  { value: "restaurant", label: "Ristorante" },
  { value: "shop", label: "Negozio" },
  { value: "farm", label: "Fattoria" },
  { value: "market", label: "Mercato" },
  { value: "cafe", label: "Caffetteria" },
  { value: "bakery", label: "Panificio" },
  { value: "other", label: "Altro" },
];

export default function SendingPlaceScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");

  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permesso negato", "Non posso ottenere la posizione.");
          setLoadingLocation(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        console.log("COORDINATE:", latitude, longitude);

        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
        const g = geo[0];

        setCoords({
          latitude,
          longitude,
          address: g?.street || null,
          city: g?.city || g?.subregion || g?.region || null,
          country: g?.country || null,
        });
      } catch (err) {
        console.log("Errore geoloc:", err);
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  async function navigate(screen) {
    navigation.navigate(screen);
  }

  async function reloadPosition() {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permesso negato");
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      const g = geo[0];

      setCoords({
        latitude,
        longitude,
        address: g?.street || null,
        city: g?.city || g?.subregion || g?.region || null,
        country: g?.country || null,
      });
    } catch (e) {
      console.log("Errore reload:", e);
    } finally {
      setLoadingLocation(false);
    }
  }

  async function submit() {
    if (!name || !category) {
      return Alert.alert("Errore", "Inserisci nome e categoria.");
    }

    const idToken = await AsyncStorage.getItem("idToken");

    const payload = {
      name,
      description,
      category,
      location: {
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
        address: coords?.address || null,
        city: coords?.city || null,
        country: coords?.country || null,
      },
    };

    try {
      await apiPost("/api/placeSuggestion", payload, {
        Authorization: `Bearer ${idToken}`,
      });

      Alert.alert("Successo", "Luogo inviato per approvazione!");
      setName("");
      setCategory(null);
      setDescription("");
      setCoords(null);
      reloadPosition();
      navigate("Map");
    } catch (err) {
      Alert.alert("Errore", err.message || "Qualcosa è andato storto.");
    }
  }
  if (loadingLocation) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#14948B" />
        <Text style={{ marginTop: 16, color: "#6B7280" }}>
          Ottenendo la tua posizione...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Segnala un luogo</Text>
        <Text style={styles.subtitle}>
          Proponi un luogo sostenibile nella tua zona
        </Text>

        {/* Nome */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Nome del luogo"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        {/* Categoria */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
          >
            <Picker.Item label="Seleziona categoria" value={null} />
            {CATEGORIES.map((c) => (
              <Picker.Item key={c.value} label={c.label} value={c.value} />
            ))}
          </Picker>
        </View>

        {/* Descrizione */}
        <View style={[styles.inputWrapper, { height: 90 }]}>
          <TextInput
            placeholder="Descrizione (opzionale)"
            style={[styles.input, { textAlignVertical: "top" }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Location */}
        {coords && (
          <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
            Posizione rilevata: {coords.address ? `${coords.address}, ` : ""}
            {coords.city ? `${coords.city}, ` : ""}
            {coords.country || ""}
          </Text>
        )}

        <Pressable style={styles.reloadButton} onPress={reloadPosition}>
          <Text style={styles.reloadButtonText}>Aggiorna posizione</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Invia Segnalazione</Text>
        </Pressable>
      </View>
    </View>
  );
}
