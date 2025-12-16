import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../screens/MapScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import ProfileScreen from "../screens/ProfileScreen";


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator initialRouteName="Map">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
            <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: true}} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false}} />
            <Stack.Screen name="Favourite" component={FavouriteScreen} options={{ headerShown: true}} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true}} />
        </Stack.Navigator>
    );
}