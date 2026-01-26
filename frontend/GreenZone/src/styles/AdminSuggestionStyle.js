import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0", // Uniformato allo sfondo App
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#14948B", // Colore Brand (Verde Petrolio)
    marginBottom: 20,
    marginTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF", // Card Bianca
    padding: 16,
    borderRadius: 16, // Arrotondamento più morbido
    marginBottom: 16,
    
    // Ombra stile App (Elevation per Android, Shadow per iOS)
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "#4B5563", // Grigio scuro
    marginBottom: 8,
  },

  desc: {
    fontSize: 14,
    color: "#6B7280", // Grigio medio per descrizione
    lineHeight: 20,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    gap: 10, // Spazio tra i bottoni
  },

  btn: {
    flex: 1, // I bottoni si dividono lo spazio equamente
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },

  approve: {
    backgroundColor: "#10b981", // Verde successo
  },

  reject: {
    backgroundColor: "#ef4444", // Rosso errore
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  
  // Aggiunto stile per il messaggio "Nessuna segnalazione"
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#6B7280",
    fontStyle: "italic",
  }
});