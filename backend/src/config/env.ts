function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

// Лабораторна №0: критичну конфігурацію застосунок бере зі змінних оточення,
// а не з захардкоджених значень у коді.
const dbHost = requireEnv("DB_HOST");
const dbPort = requireEnv("DB_PORT");
const dbName = requireEnv("DB_NAME");
const dbUser = requireEnv("DB_USER");
const dbPassword = requireEnv("DB_PASSWORD");
const frontendOrigin = requireEnv("FRONTEND_ORIGIN");

const encodedUser = encodeURIComponent(dbUser);
const encodedPassword = encodeURIComponent(dbPassword);

export const env = {
  port: Number(process.env.PORT ?? "3000"),
  frontendOrigin,
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  dbHost,
  dbPort,
  dbName,
  dbUser,
  dbPassword,
  databaseUrl:
    process.env.DATABASE_URL ??
    `postgresql://${encodedUser}:${encodedPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`,
};

// Prisma очікує DATABASE_URL у process.env, тому формуємо єдине джерело конфігурації тут.
process.env.DATABASE_URL = env.databaseUrl;
