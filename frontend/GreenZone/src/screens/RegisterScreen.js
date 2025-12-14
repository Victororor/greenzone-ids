import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyles";
import { register } from "../services/auth";

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister() {
    if (!nome.trim() || !cognome.trim() || !email.trim() || !password) {
      Alert.alert("Errore", "Per favore, compila tutti i campi.");
      return;
    }

    try {
      setLoading(true);
      const data = await register(
        email.trim(),
        password,
        nome.trim(),
        cognome.trim()
      );
      console.log("REGISTER OK:", data);
      Alert.alert("Successo", "Registrazione effettuata! Effettua il login.");
      navigation.replace("Login");
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      Alert.alert(
        "Registrazione fallita",
        error.message || "Si è verificato un errore."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.center}>
          {/* TOP */}
          <Text style={styles.title}>Crea un account</Text>
          <Text style={styles.subtitle}>
            Registrati per iniziare a utilizzare GreenZone e proteggere il tuo
            ambiente!
          </Text>

          {/* NAME */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Nome"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* SURNAME */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              value={cognome}
              onChangeText={setCognome}
              placeholder="Cognome"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </Pressable>
          </View>

          {/* REGISTER BUTTON */}
          <Pressable
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Registrazione..." : "Registrati"}
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <View style={{ flex: 1, height: 5, backgroundColor: "#D1D5DB" }} />

            <View style={{ flex: 1, height: 5, backgroundColor: "#D1D5DB" }} />
          </View>

          {/* HAVE ACCOUNT */}
          <Text style={{ marginBottom: 10, color: "#6B7280" }}>
            Hai già un account?
          </Text>

          <Pressable
            style={styles.button1}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Accedi</Text>
          </Pressable>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Image
            source={require("../../assets/leaf.png")}
            style={styles.logo}
          />
          <Text style={styles.footerText}>GreenZone 2025</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
