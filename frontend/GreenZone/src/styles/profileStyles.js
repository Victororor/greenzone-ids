import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    paddingHorizontal: 20,

    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 22,

    fontWeight: "700",
    color: "#14948B",

    marginTop: 40,
    marginBottom: 10,
    marginLeft: 4,
    textAlign: "center",
  },

  sectionTitle1: {
    fontSize: 22,
    fontWeight: "700",
    color: "#14948B",
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
    textAlign: "center",
  },

  item: {
    backgroundColor: "#FFFFFF",

    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,

    marginBottom: 12,
  },

  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    letterSpacing: 0.2,
  },
});
