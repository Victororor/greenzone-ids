import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminScreen from "../screens/AdminScreen";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";



const Stack = createNativeStackNavigator();

export default function AdminNavigator({ setRuolo }) {

  return (
    <Stack.Navigator initialRouteName="admin">
      <Stack.Screen name="admin" options={{ headerShown: true }}>
        {(props) => <AdminScreen {...props} setRuolo={setRuolo} />}
      </Stack.Screen>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
