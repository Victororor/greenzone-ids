import { StyleSheet } from "react-native";

const TAB_BAR_HEIGHT = 104;

export default StyleSheet.create({
  container: { flex: 1 },

  filterButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 4,
  },

  overlay: { flex: 1 },

  filterBox: {
    marginTop: 90,
    marginLeft: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    width: 180,
    elevation: 5,
  },

  filterItem: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8 },
  filterItemActive: { backgroundColor: "#14948B20" },
  filterLabel: { fontSize: 15, color: "#333" },
  filterLabelActive: { fontWeight: "700", color: "#14948B" },

  card: {
    position: "absolute",
    bottom: TAB_BAR_HEIGHT + 10,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    elevation: 6,
  },

  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  cardSub: { marginTop: 4, fontSize: 14, color: "#666" },

  favoriteButton: {
    marginTop: 12,
    backgroundColor: "#14948B",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  favoriteText: { color: "#fff", fontWeight: "600" },
  alreadyFav: { color: "#14948B", marginTop: 12, fontWeight: "600" },
  closeText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#444",
  },

  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: { marginTop: 10, color: "#666" },
});
