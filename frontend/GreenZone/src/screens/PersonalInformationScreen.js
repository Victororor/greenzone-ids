import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/PIStyles";

export default function PersonalInformationScreen() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const nome = await AsyncStorage.getItem("nome");
      const cognome = await AsyncStorage.getItem("cognome");
      const email = await AsyncStorage.getItem("email");

      setNome(nome || "");
      setCognome(cognome || "");
      setEmail(email || "");
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#14948B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profilo</Text>
        <Text style={styles.subtitle}>Informazioni personali</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{nome}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Cognome</Text>
          <Text style={styles.value}>{cognome}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </View>
    </View>
  );
}
