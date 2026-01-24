import React from "react";
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

const Stack = createNativeStackNavigator();

export default function RootNavigator({ setRuolo }) {
  return (
    <Stack.Navigator initialRouteName="Loading">
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
      >
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
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />

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
        options={{
          title: "Info App",
          headerBackTitle: "Indietro",
        }}
      />

      <Stack.Screen
        name="Sending"
        component={SendingPlaceScreen}
        options={{
          title: "Segnalazione",
          headerBackTitle: "Indietro",
        }}
      />
    </Stack.Navigator>
  );
}
