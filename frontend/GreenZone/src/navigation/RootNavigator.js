import React, { useEffect } from "react";
import { useState } from "react";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoadingScreen from "../screens/LoadingScreen";
import PersonalInformationScreen from "../screens/PersonalInformationScreen";
import InfoAppScreen from "../screens/InfoAppScreen";
import SendingPlaceScreen from "../screens/SendingPlaceScreen";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function RootNavigator({ ruolo, setRuolo }) {
  const [ready, setReady] = React.useState(false);
  const [logged, setLogged] = React.useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("idToken");
      const role = await AsyncStorage.getItem("ruolo");

      if (token && role === "user") setLogged(true);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack.Navigator initialRouteName={logged ? "Map" : "Login"}>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <LoginScreen {...props} setRuolo={setRuolo} />}
      </Stack.Screen>

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="Profile"
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      >
        {(props) => <ProfileScreen {...props} setRuolo={setRuolo} />}
      </Stack.Screen>

      <Stack.Screen
        name="Loading"
        options={{ headerShown: false, }}
        >
        {(props) => <LoadingScreen {...props} setRuolo={setRuolo} />}
      </Stack.Screen>

      <Stack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
        options={{
          title: "Informazioni Personali",
          headerBackTitle: "Indietro",
        }}
      />

      <Stack.Screen
        name="About"
        component={InfoAppScreen}
        options={{ title: "Info App", headerBackTitle: "Indietro" }}
      />

      <Stack.Screen
        name="Sending"
        component={SendingPlaceScreen}
        options={{ title: "Segnalazione", headerBackTitle: "Indietro" }}
      />
    </Stack.Navigator>
  );
}
