type LogLevel = "INFO" | "WARN" | "ERROR";

type LogMeta = Record<string, unknown>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

function writeLog(level: LogLevel, message: string, meta?: LogMeta) {
  const payload: Record<string, unknown> = {
    // Лабораторна №0: логи виводяться у STDOUT як структуровані JSON-об'єкти.
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (meta && Object.keys(meta).length > 0) {
    payload.meta = Object.fromEntries(
      Object.entries(meta).map(([key, value]) => [key, serializeError(value)])
    );
  }

  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    writeLog("INFO", message, meta);
  },
  warn(message: string, meta?: LogMeta) {
    writeLog("WARN", message, meta);
  },
  error(message: string, meta?: LogMeta) {
    writeLog("ERROR", message, meta);
  },
};
