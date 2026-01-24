import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import AdminNavigator from "./src/navigation/AdminNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refresh } from "./src/services/auth";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [ruolo, setRuolo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // CARICA RUOLO INIZIALE
  useEffect(() => {
    async function init() {
      const storedRole = await AsyncStorage.getItem("ruolo");
      setRuolo(storedRole);
      setIsLoading(false);
    }
    init();
  }, []);

  // REFRESH TOKEN
  useEffect(() => {
    async function refreshAuthToken() {
      const rt = await AsyncStorage.getItem("refreshToken");
      if (!rt) return;

      const interval = setInterval(
        async () => {
          try {
            const res = await refresh(rt);

            await AsyncStorage.setItem("idToken", res.idToken);
            await AsyncStorage.setItem("refreshToken", res.refreshToken);

            console.log("Token Refresh OK");
          } catch (error) {
            console.error("TOKEN REFRESH ERROR:", error);
            clearInterval(interval);
          }
        },
        55 * 60 * 1000,
      );

      return () => clearInterval(interval);
    }

    refreshAuthToken();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      {ruolo === "admin" ? (
        <AdminNavigator />
      ) : (
        <RootNavigator setRuolo={setRuolo} />
      )}
    </NavigationContainer>
  );
}
