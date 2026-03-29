module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
