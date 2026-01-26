import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 40,
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 4,
    color: "#14948B",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
    marginBottom: 16,
  },
  pickerWrapper: {
    width: "100%",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "center",
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },

  reloadButton: {
    marginTop: 6,
    marginBottom: 20,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#14948B",
    borderRadius: 20,
  },

  reloadButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#F3F4F6",
  },
});
