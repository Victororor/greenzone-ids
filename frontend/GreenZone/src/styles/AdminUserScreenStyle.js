import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    paddingTop: 60,
    paddingBottom: 20,
    textAlign: "center",
    color: "#14948B",
  },
  emptyText: {
    textAlign: "center",
    color: "#7A8A88",
    marginTop: 40,
    fontSize: 16,
  },
  cardWrapper: {
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    justifyContent: "center",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  userEmail: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#14948B",
    fontWeight: "600",
    marginTop: 4,
  },
  rightActionContainer: {
    width: 90,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  deleteButton: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
});
