import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 40,
  },
  header: {
    paddingHorizontal: 28,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#14948B",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 28,
    marginTop: 10,
  },
  item: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: "auto",
    width: "100%",
    height: 52,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
