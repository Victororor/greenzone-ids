import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminScreen from "../screens/AdminScreen";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";

const Stack = createNativeStackNavigator();
export default function AdminNavigator() {
    return (
        <Stack.Navigator initialRouteName="admin">
            <Stack.Screen
                name="admin"
                component={AdminScreen}
                options={{ headerShown: true }}
            />
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