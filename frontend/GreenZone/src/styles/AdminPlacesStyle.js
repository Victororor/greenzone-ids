import { StyleSheet } from "react-native";

export default StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#f0f0f0", 
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#14948B", 
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
  },
  // CARD STYLES
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  cardCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14948B", 
    marginBottom: 8,
  },
  rowInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#4B5563",
  },

  // MODALE STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "85%", // Limite altezza per schermi piccoli Android
    elevation: 10,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10, // Un po' meno padding per Android
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111",
  },
  
  // STILE PICKER PER ANDROID
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    justifyContent: 'center',
    height: 55, // Altezza fissa necessaria per il layout Android
  },
  picker: {
    color: "#111",
    // Su Android il picker prende tutto lo spazio disponibile nel container
    width: "100%", 
  },

  saveBtn: {
    backgroundColor: "#14948B",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: "center",
    elevation: 2,
  },
  saveBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: "#FEE2E2", 
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  deleteBtnText: {
    color: "#EF4444", 
    fontWeight: "bold",
    fontSize: 16,
  },
});