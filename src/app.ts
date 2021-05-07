import "dotenv/config";
import "reflect-metadata";

import express from "express";

import expressLoader from "@/loaders/express";
import db from "@/loaders/typeorm";

const app = express();
expressLoader(app);

const startServer = async () => {
  // fix for: "Jest has detected the following 1 open handle potentially keeping Jest from exiting"
  if (process.env.NODE_ENV === "test") return;
  await db.start();

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`\nListening on port http://localhost:${PORT}`);
  });

  return server;
};

export default startServer();
export { app };
