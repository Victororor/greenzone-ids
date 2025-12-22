import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomBar from "../components/BottomBar";

export default function ProfileScreen({ route }) {
  const { setIsLogged } = route.params;

  const [user, setUser] = useState(null);

  // 🔹 Carica nome e cognome da AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["logged", "token", "refreshToken", "user"]);
    setIsLogged(false);
  };

  return (
    <View style={styles.container}>
      {/* AVATAR */}
      <View style={styles.avatarWrapper}>
        <Ionicons name="person-circle-outline" size={110} color="#111827" />

        {/* Nome e Cognome*/}
        <Text style={styles.name}>
          {user ? `${user.nome} ${user.cognome}` : "Profilo"}
        </Text>
      </View>

      

      {/* LOGOUT */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 40,
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
