import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const TAB_BAR_HEIGHT = 64;

export default function BottomBar() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (screenName) => route.name === screenName;
  const color = (screenName) => (isActive(screenName) ? "#14948B" : "#9CA3AF");

  return (
    <View style={styles.container}>
      <Pressable style={styles.item} onPress={() => navigation.navigate("Map")}>
        <Ionicons
          name={isActive("Map") ? "map" : "map-outline"}
          size={26}
          color={color("Map")}
        />
      </Pressable>

      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate("Favourite")}
      >
        <Ionicons
          name={isActive("Favourite") ? "heart" : "heart-outline"}
          size={26}
          color={color("Favourite")}
        />
      </Pressable>

      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate("Profile")}
      >
        <Ionicons
          name={isActive("Profile") ? "person" : "person-outline"}
          size={26}
          color={color("Profile")}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
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
