import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 30,
    color: "#111827",
  },

  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },
  forgot: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 26,
    width: "100%",
    textAlign: "right",
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  button1: {
    width: "40%",
    height: 52,
    borderRadius: 30,
    backgroundColor: "#14948B",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 12,
  },
  logo: {
    width: 36,
    height: 36,
    marginBottom: 8,
    resizeMode: "contain",
  },
  footerText: {
    fontSize: 12,
    color: "#14948B",
  },
  subtitle: {
  fontSize: 15,
  fontWeight: "400",
  color: "#6B7280",
  textAlign: "center",
  marginBottom: 36,
  letterSpacing: 0.2,
},
});
