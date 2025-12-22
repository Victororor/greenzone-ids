import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MapScreen from "../screens/MapScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Pressable } from "react-native";


const Stack = createNativeStackNavigator();

function AuthStack({ setIsLogged }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        initialParams={{ setIsLogged }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        initialParams={{ setIsLogged }}
      />
    </Stack.Navigator>
  );
}

function AppStack({ setIsLogged }) {
  return (
    <Stack.Navigator screenOptions={{headerBackVisible: false, headerLeft: () => null}}>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Favourite" component={FavouriteScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ setIsLogged }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const value = await AsyncStorage.getItem("logged");
      setIsLogged(value === "1");
    };
    checkAuth();
  }, []);

  if (isLogged === null) return null;

  return isLogged ? (
    <AppStack setIsLogged={setIsLogged} />
  ) : (
    <AuthStack setIsLogged={setIsLogged} />
  );
}
