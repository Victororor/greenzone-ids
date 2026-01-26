import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminScreen from "../screens/AdminScreen"; 

const Stack = createNativeStackNavigator();

export default function AdminNavigator({ setRuolo }) {
  return (
    <Stack.Navigator initialRouteName="admin">
      <Stack.Screen 
        name="admin" 
        options={{ 
          headerShown: true,
          title: "Pannello Admin" 
        }}
      >
        {(props) => <AdminScreen {...props} setRuolo={setRuolo} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}