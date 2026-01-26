import React, { useEffect } from "react";
import { useState } from "react";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoadingScreen from "../screens/LoadingScreen";
import PersonalInformationScreen from "../screens/PersonalInformationScreen";
import InfoAppScreen from "../screens/InfoAppScreen";
import SendingPlaceScreen from "../screens/SendingPlaceScreen";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function RootNavigator({ setRuolo }) {

  return (
    <Stack.Navigator >

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
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="Profile"
        options={{
          headerShown: false,
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
