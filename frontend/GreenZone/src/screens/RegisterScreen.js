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
        {/* TOP */}
        <View style={styles.center}>
          <Text style={styles.title}>Crea un account</Text>
          <Text style={styles.subtitle}>
            Registrati per iniziare a utilizzare GreenZone e proteggere il tuo
            ambiente!
          </Text>
        </View>

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
