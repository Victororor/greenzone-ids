import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login, getMe } from "../services/auth";
import styles from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, route }) {
  const { setIsLogged } = route.params;
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

      // 1) Login backend (ti ritorna idToken, refreshToken e user)
      const res = await login(email.trim(), password);
      console.log("LOGIN OK:", res);

      const token = res?.data?.idToken;
      const refreshToken = res?.data?.refreshToken;
      let user = res?.data?.user;

      if (!token) {
        throw new Error("Token mancante nella risposta del login");
      }

      // 2) Salva token/refresh
      await AsyncStorage.setItem("token", token);
      if (refreshToken) {
        await AsyncStorage.setItem("refreshToken", refreshToken);
      }

      // 3) Se il backend NON ti ha dato user, lo prendi con /api/users/me
      if (!user) {
        const meRes = await getMe(token);
        user = meRes?.data?.user;
      }

      // 4) Salva profilo (nome/cognome/email/ruolo/uid)
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }

      // 5) Switch stack -> MapScreen (tramite RootNavigator)
      setIsLogged(true);
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      Alert.alert("Login fallito", error.message || "Credenziali non valide.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* TOP */}
        <View style={styles.center}>
          <Text style={styles.title}>Accedi</Text>

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

          {/* BUTTON LOGIN */}
          <Pressable
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Accesso..." : "Accedi"}
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

          <Text style={{ marginBottom: 10, color: "#6B7280" }}>
            Non hai un account?
          </Text>
          <Pressable
            style={[styles.button1, loading && { opacity: 0.7 }]}
            onPress={() => {
              navigation.navigate("Register");
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Registrati</Text>
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
