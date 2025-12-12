import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../services/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Errore", "Per favore, inserisci email e password.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email.trim(), password);
      console.log("LOGIN OK:", data);

      // TODO: qui poi salvi token ecc.

      navigation.replace("Home");
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      Alert.alert("Login fallito", error.message || "Credenziali non valide.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* TOP */}
      <View style={styles.center}>
        <Text style={styles.title}>Accedi</Text>

        {/* EMAIL */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#6B7280" />
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
            secureTextEntry ={!showPassword}
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

        

        {/* BUTTON LOGIN */}
        <Pressable
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Accesso..." : "Accedi"}</Text>
        </Pressable>

        <Text style={{ marginBottom: 10, color: "#6B7280" }}>
          Non hai un account?
        </Text>

        <Pressable
          style={[styles.button1, loading && { opacity: 0.7 }]}
          onPress={() => {
            // navigation.navigate("RegisterScreen");
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Registrati</Text>
        </Pressable>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Image source={require("../../assets/leaf.png")} style={styles.logo} />
        <Text style={styles.footerText}>GreenZone 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 40,
    color: "#111827",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },
  forgot: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 26,
    width: "100%",
    textAlign: "right",
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  button1: {
    width: "40%",
    height: 52,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 8,
    resizeMode: "contain",
  },
  footerText: {
    fontSize: 12,
    color: "#14948B",
  },
});
