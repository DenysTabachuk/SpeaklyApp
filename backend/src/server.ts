import "dotenv/config";
import { execFile } from "child_process";
import { Server } from "http";
import { promisify } from "util";
import path from "path";
import app from "./app";
import { prisma } from "./config/db";
import { env } from "./config/env";
import { logger } from "./logger";

const execFileAsync = promisify(execFile);
const PORT = env.port;
let server: Server | null = null;
let isShuttingDown = false;

async function runMigrations() {
  const prismaCliPath = path.resolve(
    __dirname,
    "..",
    "node_modules",
    "prisma",
    "build",
    "index.js"
  );
  const schemaPath = path.resolve(__dirname, "..", "prisma", "schema.prisma");

  await execFileAsync(
    process.execPath,
    [prismaCliPath, "migrate", "deploy", "--schema", schemaPath],
    {
      cwd: path.resolve(__dirname, ".."),
      env: process.env,
    }
  );
}

async function startServer() {
  await runMigrations();

  server = app.listen(PORT, () => {
    logger.info("Server started", {
      port: PORT,
      url: `http://localhost:${PORT}`,
    });
  });
}

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();
    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Graceful shutdown failed", { error });
    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

startServer().catch((error) => {
  logger.error("Failed to start server", { error });
  process.exit(1);
});
