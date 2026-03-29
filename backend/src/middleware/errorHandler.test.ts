import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";

function createResponse() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));

  return {
    status,
    json,
  } as unknown as Response;
}

describe("errorHandler", () => {
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it("returns 500 for unexpected errors", () => {
    const err = new Error("boom");
    const req = {} as Request;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect((res.status as jest.Mock).mock.results[0].value.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });
});
