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

export default function RegisterScreen({ navigation }) {
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
              placeholder="Nome"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* SURNAME */}
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              placeholder="Cognome"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
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
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* REGISTER BUTTON */}
          <Pressable
            style={styles.button}
            onPress={() => Alert.alert("Registrazione effettuata!")}
          >
            <Text style={styles.buttonText}>Registrati</Text>
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
