import { getHealth } from "./health.controller";
import { prisma } from "../config/db";

jest.mock("../config/db", () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}));

describe("getHealth", () => {
  let consoleErrorSpy: jest.SpyInstance;

  const createResponse = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("returns 200 when database is reachable", async () => {
    const res = createResponse();
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ "?column?": 1 }]);

    await getHealth({} as never, res as never);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "ok",
      database: "up",
    });
  });

  it("returns 503 when database is unavailable", async () => {
    const res = createResponse();
    (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error("DB down"));

    await getHealth({} as never, res as never);

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: "unavailable",
      database: "down",
    });
  });
});
