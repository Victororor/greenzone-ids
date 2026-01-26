import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import AdminNavigator from "./src/navigation/AdminNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator"; // <--- IMPORTA QUESTO
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
      try {
        const storedRole = await AsyncStorage.getItem("ruolo");
        setRuolo(storedRole); // Se non c'è, sarà null
      } catch(e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // ... il tuo codice per il refresh token resta uguale ...

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#14948B" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Usiamo key={ruolo} per forzare il re-render completo quando cambia stato */}
      <NavigationContainer key={ruolo}> 
        
        {/* SE NON LOGGATO (ruolo è null) -> VAI ALL'AUTH NAVIGATOR */}
        {ruolo === null && <AuthNavigator setRuolo={setRuolo} />}

        {/* SE UTENTE -> VAI AL ROOT NAVIGATOR (Mappa, Profilo, ecc) */}
        {ruolo === "user" && <RootNavigator setRuolo={setRuolo} />}

        {/* SE ADMIN -> VAI ALL'ADMIN NAVIGATOR */}
        {ruolo === "admin" && <AdminNavigator setRuolo={setRuolo} />}

      </NavigationContainer>
    </GestureHandlerRootView>
  );
}