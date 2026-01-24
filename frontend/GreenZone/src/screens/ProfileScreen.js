import React from "react";
import { View, Text, Pressable, Alert, StyleSheet, ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";
import { logout } from "../services/auth";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import styles from "../styles/profileStyles";

export default function ProfileScreen() {
  const navigation = useNavigation();

  function goTo(screen) {
    navigation.navigate(screen);
  }

  useEffect(() => {
    (async () => {
      setNome(await AsyncStorage.getItem("nome"));
      setCognome(await AsyncStorage.getItem("cognome"));
    })();
  }, []);

  async function handleLogout() {
    try {
      const idToken = await AsyncStorage.getItem("idToken");

      if (idToken) {
        await logout(idToken);
      }

      await AsyncStorage.multiRemove(["idToken", "role", "refreshToken", "nome", "cognome", "email"]);

      navigation.replace("Login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      Alert.alert("Errore di logout", error?.message || "Riprova.");
      navigation.replace("Login");
    }
  }

  return (
    <View style={styles.container}>



      <ScrollView contentContainerStyle={styles.inner}>
        
        <Text style={styles.sectionTitle}>Account</Text>

        <Pressable style={styles.item} onPress={() => goTo("PersonalInformationScreen")}>
          <Text style={styles.itemText}>Informazioni Personali</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>App</Text>

        <Pressable style={styles.item} onPress={() => goTo("Sending")}>
          <Text style={styles.itemText}>Segnala un luogo</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Altro</Text>

        <Pressable style={styles.item} onPress={() => goTo("About")}>
          <Text style={styles.itemText}>Info App</Text>
        </Pressable>

        <Pressable style={[styles.item, { backgroundColor: "#fbeaea" }]} onPress={handleLogout}>
          <Text style={[styles.itemText, { color: "#c62828" }]}>Logout</Text>
        </Pressable>

      </ScrollView>

      <BottomBar />
    </View>
  );
}


