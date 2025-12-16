// setup e avvio del server (app.listen)
require("dotenv").config();

const { app } = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || "development"}`);
});

// Shutdown pulito
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} ricevuto. Chiusura server...`);
  server.close(() => {
    console.log("Server chiuso correttamente.");
    process.exit(0);
  });

  // Forza chiusura dopo 10 secondi
  setTimeout(() => {
    console.error("Chiusura forzata dopo timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Gestione errori non catturati
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
