import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminSuggestion from "../screens/AdminSuggestion";
import AdminDashboard from "../screens/AdminDashboard";
import InfoAppScreen from "../screens/InfoAppScreen";
import PersonalInformationScreen from "../screens/PersonalInformationScreen";
import AdminPlaces from "../screens/AdminPlaces";

const Stack = createNativeStackNavigator();

export default function AdminNavigator({ setRuolo }) {
  return (
    <Stack.Navigator initialRouteName="AdminSuggestions">
      
      {/* AdminSuggestions: Usa la funzione per passare setRuolo */}
      <Stack.Screen
        name="AdminSuggestions"
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      >
        {(props) => <AdminSuggestion {...props} setRuolo={setRuolo} />}
      </Stack.Screen>

      {/* AdminDashboard: ANCHE QUI serve setRuolo per il Logout.
          Quindi ho RIMOSSO 'component={AdminDashboard}' e lasciato solo la funzione interna. */}
      <Stack.Screen
        name="AdminDashboard"
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      >
        {(props) => <AdminDashboard {...props} setRuolo={setRuolo} />}
      </Stack.Screen>

      {/* Le schermate sotto non hanno logout diretto, usiamo component standard */}
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
          headerBackTitle: "Indietro" }}
      />

      <Stack.Screen
        name="AdminPlaces"
        component={AdminPlaces}
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}