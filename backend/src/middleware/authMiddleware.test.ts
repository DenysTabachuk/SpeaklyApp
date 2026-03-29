import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "./authMiddleware";

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    verify: jest.fn(),
  },
  TokenExpiredError: class TokenExpiredError extends Error {},
}));

function createResponse() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));

  return {
    status,
    json,
  } as unknown as Response;
}

describe("authMiddleware", () => {
  it("returns 401 when authorization header is missing", () => {
    const req = { headers: {} } as AuthRequest;
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect((res.status as jest.Mock).mock.results[0].value.json).toHaveBeenCalledWith({
      error: "No token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and attaches user when token is valid", () => {
    const req = {
      headers: { authorization: "Bearer valid-token" },
    } as AuthRequest;
    const res = createResponse();
    const next = jest.fn() as NextFunction;
    const verifyMock = jwt.verify as jest.Mock;
    const decodedUser = {
      userId: 1,
      name: "Denys",
      email: "tabakdenuc@gmail.com",
    };

    verifyMock.mockReturnValue(decodedUser);

    authMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledWith("valid-token", process.env.JWT_SECRET);
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });
});
