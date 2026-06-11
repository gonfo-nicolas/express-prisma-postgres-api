import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const app = createApp();
const server = createServer(app);

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  logger.info({ signal }, "Shutdown signal received");
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", (signal) => {
  void shutdown(signal);
});

process.on("SIGINT", (signal) => {
  void shutdown(signal);
});

server.listen(env.PORT, env.HOST, () => {
  logger.info({ host: env.HOST, port: env.PORT }, "API server listening");
});
