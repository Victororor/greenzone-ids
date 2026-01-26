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
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 50,
    paddingBottom: 10,
    textAlign: "center",
    color: "#14948B",
  },

  emptyText: {
    textAlign: "center",
    color: "#7A8A88",
    marginTop: 30,
    fontSize: 15,
  },

  cardWrapper: {
    marginHorizontal: 18,
    marginBottom: 12,     
    borderRadius: 14,    
    overflow: "hidden",   
    backgroundColor: "#FFFFFF", 
  },

  category: {
    fontSize: 14,
    color: "#14948B",
    marginTop: 2,
  },

  location: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },


  card: {
    backgroundColor: "#FFFFFF",
    padding: 14,
  },

  rightActionContainer: {
    width: 88,
    backgroundColor: "#E44949",
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