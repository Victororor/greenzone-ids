import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import AdminNavigator from "./src/navigation/AdminNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refresh } from "./src/services/auth";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [ruolo, setRuolo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carica ruolo all'avvio
  useEffect(() => {
    async function init() {
      const storedRole = await AsyncStorage.getItem("ruolo");
      setRuolo(storedRole);
      setIsLoading(false);
    }
    init();
  }, []);

  // Refresh token
  useEffect(() => {
    async function refreshAuthToken() {
      const rt = await AsyncStorage.getItem("refreshToken");
      if (!rt) return;

      const interval = setInterval(async () => {
        try {
          const res = await refresh(rt);

          await AsyncStorage.setItem("idToken", res.idToken);
          await AsyncStorage.setItem("refreshToken", res.refreshToken);
        } catch (error) {
          console.error("TOKEN REFRESH ERROR:", error);
          clearInterval(interval);
        }
      }, 55 * 60 * 1000);

      return () => clearInterval(interval);
    }

    refreshAuthToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#14948B" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer key={ruolo}>
        {ruolo === null && <RootNavigator setRuolo={setRuolo} />}
        {ruolo === "user" && <RootNavigator setRuolo={setRuolo} />}
        {ruolo === "admin" && <AdminNavigator setRuolo={setRuolo} />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
