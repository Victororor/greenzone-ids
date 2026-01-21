import React from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";
import { logout } from "../services/auth";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  async function handleLogout() {
    try {
      const idToken = await AsyncStorage.getItem("idToken");

      if (idToken) {
        await logout(idToken);
      }

      await AsyncStorage.multiRemove(["idToken", "role", "refreshToken"]);

      navigation.replace("Login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      Alert.alert("Errore di logout", error?.message || "Riprova.");
      navigation.replace("Login");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schermata Profilo</Text>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d9534f",
    borderRadius: 6,
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold" },
});
