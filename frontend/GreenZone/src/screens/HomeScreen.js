import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomBar from "../components/BottomBar";

const TAB_BAR_HEIGHT = 104;

export default function HomeScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permesso negato",
          "Serve la posizione per usare la mappa"
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  if (!location) return null;

  return (
    <View style={styles.container}>
      {/* MAPPA */}
      <MapView
        style={[StyleSheet.absoluteFillObject, { bottom: TAB_BAR_HEIGHT }]}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: location.latitude + 0.002,
            longitude: location.longitude + 0.002,
          }}
          title="Punto Green"
        />
      </MapView>

      {/* NAVBAR APP */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
