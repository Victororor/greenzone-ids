import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Uniformato allo sfondo delle altre schermate
  },

  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  info: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },

  inner: {
    paddingTop: 10,
    paddingHorizontal: 20, // Margine laterale standard (come la lista preferiti)
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 22, // Leggermente ridotto per eleganza (era 26)
    fontWeight: "700",
    color: "#14948B", // Verde brand
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 4, // Allineamento ottico con le card
  },

  sectionTitle1: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14948B",
    marginTop: 24, // Spazio separatore tra le sezioni
    marginBottom: 10,
    marginLeft: 4,
  },

  item: {
    backgroundColor: "#FFFFFF", // Card bianca
    paddingVertical: 16,        // Più spazio per il dito
    paddingHorizontal: 18,
    borderRadius: 12,           // Arrotondamento coerente con FavouriteScreen
    marginBottom: 12,
    
  },

  itemText: {
    fontSize: 16,
    fontWeight: "600", // Testo un po' più marcato per leggibilità
    color: "#333333",
    letterSpacing: 0.2,
  },
});