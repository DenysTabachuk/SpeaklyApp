import "dotenv/config";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import app from "./app";
import { env } from "./config/env";

const execFileAsync = promisify(execFile);
const PORT = env.port;

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

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
