import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import AdminBottomBar from "../components/AdminBottomBar";
import {
  getSuggestionsPending,
  approveSuggestion,
  rejectSuggestion,
} from "../services/placeSuggestion";
import styles from "../styles/AdminSuggestionStyle";

export default function AdminSuggestionsScreen({ setRuolo }) {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  {
    /* Carica le segnalazioni dall'API */
  }
  async function loadSuggestions() {
    try {
      setLoading(true);
      const res = await getSuggestionsPending();
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.log("LOAD ERROR:", err);
      Alert.alert("Errore", err.message || "Impossibile caricare");
    } finally {
      setLoading(false);
    }
  }

  {
    /* Approva una segnalazione */
  }

  async function handleApprove(id) {
    try {
      await approveSuggestion(id); // POST /approve
      Alert.alert("Successo", "Luogo approvato ed inserito nella mappa");
      loadSuggestions();
    } catch (err) {
      console.log("APPROVE ERROR:", err);
      Alert.alert("Errore", err.message || "Impossibile approvare");
    }
  }

  {
    /* Rifiuta una segnalazione */
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      {item.location?.city && (
        <Text style={styles.subtitle}>
          {item.location.address}, {item.location.city}
        </Text>
      )}
      {item.description && <Text style={styles.desc}>{item.description}</Text>}

      <View style={styles.row}>
        <Pressable
          style={[styles.btn, styles.approve]}
          onPress={() => handleApprove(item.id)}
        >
          <Text style={styles.btnText}>Approva</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.reject]}
          onPress={() => handleReject(item.id)}
        >
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
      <AdminBottomBar />
    </View>
  );
}
