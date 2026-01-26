import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminSuggestion from "../screens/AdminSuggestionScreen";
import AdminDashboard from "../screens/AdminDashboard";
import InfoAppScreen from "../screens/InfoAppScreen";
import PersonalInformationScreen from "../screens/PersonalInformationScreen";
import AdminPlaces from "../screens/AdminPlacesScreen";
import AdminUser from "../screens/AdminUserScreen";

const Stack = createNativeStackNavigator();

{/* Navigator per la sezione admin dell'app */}

export default function AdminNavigator({ setRuolo }) {
  return (
    <Stack.Navigator initialRouteName="AdminSuggestions">
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
        name="AdminPlaces"
        component={AdminPlaces}
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <Stack.Screen
        name="AdminUser"
        component={AdminUser}
        options={{
          headerShown: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
}
