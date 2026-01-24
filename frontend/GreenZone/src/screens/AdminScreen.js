import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert, StyleSheet } from "react-native";
import { getSuggestionsPending, approveSuggestion, rejectSuggestion } from "../services/placeSuggestion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../services/auth";
import { useNavigation } from "@react-navigation/native";


export default function AdminSuggestionsScreen({ setRuolo }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  async function loadSuggestions() {
    try {
      setLoading(true);
      const res = await getSuggestionsPending(); // GET /api/placeSuggestion
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.log("LOAD ERROR:", err);
      Alert.alert("Errore", err.message || "Impossibile caricare");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      await approveSuggestion(id); // POST /approve
      Alert.alert("Successo", "Luogo approvato ed inserito 👍");
      loadSuggestions();
    } catch (err) {
      console.log("APPROVE ERROR:", err);
      Alert.alert("Errore", err.message || "Impossibile approvare");
    }
  }

  async function handleReject(id) {
    try {
      await rejectSuggestion(id); // POST /reject
      Alert.alert("Rifiutato", "Segnalazione rifiutata");
      loadSuggestions();
    } catch (err) {
      console.log("REJECT ERROR:", err);
      Alert.alert("Errore", err.message || "Impossibile rifiutare");
    }
  }

  useEffect(() => {
    loadSuggestions();


  }, []);

  async function handleLogout() {
    try {
      const idToken = await AsyncStorage.getItem("idToken");

      if (idToken) {
        await logout(idToken);
      }

      await AsyncStorage.multiRemove(["idToken", "ruolo", "refreshToken", "nome", "cognome", "email"]);
      setRuolo(null);

      navigation.replace("Login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      Alert.alert("Errore di logout", error?.message || "Riprova.");
      navigation.replace("Login");
    }
  }


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      {item.location?.city && (
        <Text style={styles.subtitle}>{item.location.city}</Text>
      )}
      {item.description && (
        <Text style={styles.desc}>{item.description}</Text>
      )}
      
      <View style={styles.row}>
        <Pressable style={[styles.btn, styles.approve]} onPress={() => handleApprove(item.id)}>
          <Text style={styles.btnText}>Approva</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.reject]} onPress={() => handleReject(item.id)}>
          <Text style={styles.btnText}>Rifiuta</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Segnalazioni utenti</Text>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : suggestions.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Nessuna segnalazione in attesa</Text>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>



    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#555" },
  desc: { marginTop: 6, color: "#444" },
  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between"
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  approve: { backgroundColor: "#10b981" },
  reject: { backgroundColor: "#ef4444" },
  btnText: { color: "#fff", fontWeight: "bold" },

  logoutButton: {
    marginTop: "auto",
    width: "100%",
    height: 52,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
