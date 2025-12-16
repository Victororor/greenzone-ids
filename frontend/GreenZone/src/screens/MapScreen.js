import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import BottomBar from "../components/BottomBar";

const TAB_BAR_HEIGHT = 104;

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permesso negato", "Serve la posizione per usare la mappa");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const isReady = location && mapReady;

  return (
    <View style={styles.container}>
      {/* MAPPA */}
      {location && (
        <MapView
          style={[
            StyleSheet.absoluteFillObject,
            { bottom: TAB_BAR_HEIGHT, opacity: isReady ? 1 : 0 },
          ]}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            coordinate={{
              latitude: location.latitude + 0.002,
              longitude: location.longitude + 0.002,
            }}
            title="Punto Green"
          />
        </MapView>
      )}

      {/* LOADING finché non è pronta */}
      {!isReady && (
        <View style={styles.loader}>
          <ActivityIndicator
            size="large"
            color="#14948B"
            style={{ transform: [{ scale: 2 }] }}
          />

          <Text style={styles.loaderText}>Caricamento...</Text>
        </View>
      )}

      {/* NAVBAR APP */}
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#0b0e14ff",
    textAlign: "center",
  },
});
