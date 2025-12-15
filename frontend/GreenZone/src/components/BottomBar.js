import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 64;

export default function BottomBar() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.item}>
        <Ionicons name="home-outline" size={26} color="#14948B" />
      </Pressable>

      <Pressable style={styles.item}>
        <Ionicons name="map-outline" size={26} color="#9CA3AF" />
      </Pressable>

      <Pressable style={styles.item}>
        <Ionicons name="heart-outline" size={26} color="#9CA3AF" />
      </Pressable>

      <Pressable style={styles.item}>
        <Ionicons name="person-outline" size={26} color="#9CA3AF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",   // 🔴 FONDAMENTALE
    bottom: 40,              // 🔴 FONDAMENTALE
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
});
