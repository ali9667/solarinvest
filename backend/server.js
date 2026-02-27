import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[SERVER] SolarInvest API v3.0.0 running on port ${PORT}`);
  console.log(`[SERVER] Env: ${process.env.NODE_ENV || "development"}`);
  console.log(`[SERVER] Health: http://localhost:${PORT}/api/health`);
});

const shutdown = (signal) => {
  console.log(`\n[SERVER] ${signal} — shutting down gracefully`);
  server.close(() => { console.log("[SERVER] Closed"); process.exit(0); });
  setTimeout(() => process.exit(1), 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => console.error("[SERVER] Unhandled rejection:", reason));
