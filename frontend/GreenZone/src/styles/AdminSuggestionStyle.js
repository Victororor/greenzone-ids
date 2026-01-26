import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#14948B",
    marginBottom: 20,
    marginTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF", // Card Bianca
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },

  desc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    gap: 10,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  approve: {
    backgroundColor: "#10b981",
  },

  reject: {
    backgroundColor: "#ef4444",
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
  },
});
