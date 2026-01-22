import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  info: {
    fontSize: 20,
    fontWeight: "600",
  },
  inner: {
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#666",
    marginTop: 10,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
});