const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(rootDir, "frontend");

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const dockerComposeCommand = isWindows ? "docker-compose.exe" : "docker-compose";

const mode = process.argv[2] === "prod" ? "prod" : "dev";
const backendScript = mode === "prod" ? "start" : "dev";
const frontendScript = mode === "prod" ? "preview" : "dev";

const children = [];
let shuttingDown = false;

function spawnProcess(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
    shell: isWindows,
  });

  children.push({ name, child });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.error(`[stack] ${name} exited with ${reason}`);
    void shutdown(code ?? 1);
  });

  child.on("error", (error) => {
    if (shuttingDown) {
      return;
    }

    console.error(`[stack] Failed to start ${name}:`, error);
    void shutdown(1);
  });

  return child;
}

function terminateChild(child) {
  if (child.exitCode !== null || child.killed) {
    return;
  }

  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

function waitForChildExit(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null) {
      resolve();
      return;
    }

    child.once("exit", () => resolve());
  });
}

async function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const { child } of children) {
    terminateChild(child);
  }

  await Promise.all(children.map(({ child }) => waitForChildExit(child)));
  process.exit(exitCode);
}

async function startDocker() {
  await new Promise((resolve, reject) => {
    const child = spawn(
      dockerComposeCommand,
      ["up", "-d"],
      {
        cwd: backendDir,
        stdio: "inherit",
        env: process.env,
        shell: isWindows,
      }
    );

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`docker-compose up -d exited with code ${code}`));
    });

    child.on("error", reject);
  });
}

async function main() {
  await startDocker();

  spawnProcess("backend", npmCommand, ["run", backendScript], backendDir);
  spawnProcess("frontend", npmCommand, ["run", frontendScript], frontendDir);
}

process.on("SIGINT", () => {
  void shutdown(0);
});

process.on("SIGTERM", () => {
  void shutdown(0);
});

main().catch((error) => {
  console.error("[stack] Failed to start application stack:", error);
  process.exit(1);
});
