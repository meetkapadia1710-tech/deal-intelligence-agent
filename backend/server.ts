import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { initBank } from "./src/services/memory.service.js";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, async () => {
  console.log("🚀 Strict TypeScript API running on http://localhost:" + PORT);
  await initBank();
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error("\n❌ Port " + PORT + " is already in use.\n");
    process.exit(1);
  }
});
process.on("SIGINT", () => { server.close(); process.exit(0); });
process.on("SIGTERM", () => { server.close(); process.exit(0); });
