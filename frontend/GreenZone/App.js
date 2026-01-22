import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refresh} from './src/services/auth';

export default function App() {

  useEffect(() => {
    async function refreshAuthToken() {

      const rt = await AsyncStorage.getItem("refreshToken");
      
      if (!rt) return;

      const interval = setInterval(async () => {
        try{
          const res = await refresh(rt);

          await AsyncStorage.setItem("idToken", res.idToken);
          await AsyncStorage.setItem("refreshToken", res.refreshToken);

        } catch (error) {

          console.error("TOKEN REFRESH ERROR:", error);
          clearInterval(interval);

        }
      }, 15 * 60 * 1000); // ogni 15 minuti

    return () => clearInterval(interval);
    }

    refreshAuthToken();
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator/>
    </NavigationContainer>
  );
}