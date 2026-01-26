import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminBottomBar from "../components/AdminBottomBar";
import { logout } from "../services/auth";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/profileStyles";

export default function AdminDashboard({ setRuolo }) {
  const navigation = useNavigation();
  
  // MANCAVANO QUESTI STATE:
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");

  function goTo(screen) {
    navigation.navigate(screen);
  }

  useEffect(() => {
    (async () => {
      const n = await AsyncStorage.getItem("nome");
      const c = await AsyncStorage.getItem("cognome");
      if (n) setNome(n);
      if (c) setCognome(c);
    })();
  }, []);

  async function handleLogout() {
    try {
      const idToken = await AsyncStorage.getItem("idToken");
      if (idToken) await logout(idToken);

      await AsyncStorage.multiRemove(["idToken", "ruolo", "refreshToken", "nome", "cognome", "email"]);
      
      // Logout pulito
      setRuolo(null); 
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      await AsyncStorage.clear();
      setRuolo(null);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <Pressable
          style={styles.item}
          onPress={() => goTo("PersonalInformationScreen")}
        >
          <Text style={styles.itemText}>Informazioni Personali</Text>
        </Pressable>

        <Text style={styles.sectionTitle1}>Altro</Text>

        <Pressable style={styles.item} onPress={() => goTo("About")}>
          <Text style={styles.itemText}>Info App</Text>
        </Pressable>

        <Pressable
          style={[styles.item, { backgroundColor: "#fbeaea" }]}
          onPress={handleLogout}
        >
          <Text style={[styles.itemText, { color: "#c62828" }]}>Logout</Text>
        </Pressable>
      </ScrollView>

      <AdminBottomBar/>
    </View>
  );
}