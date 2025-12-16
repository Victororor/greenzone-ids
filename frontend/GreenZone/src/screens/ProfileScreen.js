import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomBar from "../components/BottomBar";

export default function FavouriteScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Schermata Profilo</Text>
        <BottomBar />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
});