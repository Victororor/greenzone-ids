import React from "react";
import { ScrollView, View, Text } from "react-native";
import styles from "../styles/AppInfoStyles";

export default function AppInfoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Informazioni sull’app</Text>
        <Text style={styles.subtitle}>GreenZone</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrizione</Text>
        <Text style={styles.text}>
          GreenZone è un progetto realizzato dagli studenti del corso di
          Ingegneria del Software dell’Università Ca’ Foscari Venezia con
          l’obiettivo di supportare la transizione verso una vita urbana più
          sostenibile attraverso mappe, percorsi e segnalazioni ambientali.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tecnologie</Text>
        <Text style={styles.text}>
          React Native{"\n"}
          Firebase • Firestore{"\n"}
          Expo-location{"\n"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team</Text>
        <Text style={styles.text}>
          Francesco Pezzuto — Team Leader{"\n"}
          Matteo Tarushi — UI/UX & Testing{"\n"}
          Victor Hortopan — Backend & Firebase
        </Text>
      </View>

      <Text style={styles.footer}>
        Uso didattico — Non commerciale{"\n"}
        Versione 1.0.0 (Beta)
      </Text>
    </ScrollView>
  );
}
