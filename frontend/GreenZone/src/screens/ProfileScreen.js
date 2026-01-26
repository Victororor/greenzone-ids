import React from "react";
import { View, Text, Pressable, Alert, StyleSheet, ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";
import { logout } from "../services/auth";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import styles from "../styles/profileStyles";

export default function ProfileScreen({ setRuolo }) {
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
      if (idToken) await logout(idToken);

      // Rimuovi tutto
      await AsyncStorage.multiRemove(["idToken", "ruolo", "refreshToken", "nome", "cognome", "email"]);
      
      // QUESTO E' IMPORTANTE:
      // Settando null, App.js rileverà il cambio e mostrerà AuthNavigator automaticamente
      setRuolo(null); 
      
      // Non serve navigation.replace("Login"), lo fa React da solo grazie allo stato
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      // Anche in caso di errore, forza il logout locale
      await AsyncStorage.clear();
      setRuolo(null);
    }
}

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.inner}>
        
        <Text style={styles.sectionTitle}>Account</Text>

        <Pressable style={styles.item} onPress={() => goTo("PersonalInformationScreen")}>
          <Text style={styles.itemText}>Informazioni Personali</Text>
        </Pressable>

        <Text style={styles.sectionTitle1}>App</Text>

        <Pressable style={styles.item} onPress={() => goTo("Sending")}>
          <Text style={styles.itemText}>Segnala un luogo</Text>
        </Pressable>

        <Text style={styles.sectionTitle1}>Altro</Text>

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

