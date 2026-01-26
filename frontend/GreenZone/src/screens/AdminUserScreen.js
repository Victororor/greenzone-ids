import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import styles from "../styles/AdminUserScreenStyle";
import AdminBottomBar from "../components/AdminBottomBar";

// 1. IMPORTA DAL NUOVO SERVICE
import { getAllUsers, deleteUser } from "../services/user";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  let row = [];
  let prevOpenedRow;

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await getAllUsers();
      const allUsers = res.data.users || res.data || [];

      const filteredUsers = allUsers.filter((user) => user.ruolo !== "admin");

      setUsers(filteredUsers);
    } catch (e) {
      console.log("ERR UTENTI:", e);
      Alert.alert("Errore", "Impossibile caricare la lista utenti.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(uid) {
    try {
      await deleteUser(uid);
      // Rimuovi filtrando per uid
      setUsers((prev) => prev.filter((item) => item.uid !== uid));
      Alert.alert("Successo", "Utente eliminato correttamente.");
    } catch (e) {
      console.log("Errore rimozione:", e);
      Alert.alert("Errore", "Impossibile eliminare l'utente.");
    }
  }

  const confirmDelete = (uid) => {
    Alert.alert(
      "Elimina Utente",
      "Questa azione è irreversibile. Vuoi davvero eliminare questo utente?",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Sì, elimina",
          style: "destructive",
          onPress: () => handleDelete(uid),
        },
      ],
    );
  };

  const renderRightActions = (progress, dragX, uid) => {
    return (
      <View style={styles.rightActionContainer}>
        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            if (prevOpenedRow && prevOpenedRow !== row[uid]) {
              prevOpenedRow.close();
            }
            confirmDelete(uid);
          }}
        >
          <Ionicons name="trash-outline" size={26} color="#fff" />
          <Text style={styles.deleteText}>Elimina</Text>
        </Pressable>
      </View>
    );
  };

  const closeRow = (index) => {
    // Nota: qui usiamo l'indice dell'array per gestire i ref delle righe
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Gestione Utenti</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#14948B" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {users.length === 0 ? (
              <Text style={styles.emptyText}>Nessun utente trovato.</Text>
            ) : (
              users.map((user, index) => (
                // USIAMO user.uid come key univoca
                <View key={user.uid} style={styles.cardWrapper}>
                  <Swipeable
                    ref={(ref) => (row[index] = ref)}
                    onSwipeableOpen={() => closeRow(index)}
                    renderRightActions={(progress, dragX) =>
                      renderRightActions(progress, dragX, user.uid)
                    }
                    overshootRight={false}
                  >
                    <View style={styles.card}>
                      <View style={styles.userInfoRow}>
                        <View style={styles.avatarContainer}>
                          <Ionicons name="person" size={20} color="#14948B" />
                        </View>

                        <View style={styles.textContainer}>
                          {/* --- CORREZIONE NOME --- */}
                          <Text style={styles.userName}>
                            {user.nome} {user.cognome}
                          </Text>

                          <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                      </View>
                    </View>
                  </Swipeable>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
      <AdminBottomBar />
    </GestureHandlerRootView>
  );
}
