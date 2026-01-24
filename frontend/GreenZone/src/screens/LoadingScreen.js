import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function LoadingScreen({ setRuolo }) {
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("idToken");
      const role = await AsyncStorage.getItem("ruolo");

      if (token && role) {
        setRuolo(role);
      } else {
        setRuolo(null);
      }
    })();
  }, []);

  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <ActivityIndicator size="large" />
    </View>
  );
}
