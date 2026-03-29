import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { logger } from "../logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Unhandled request error", {
    error: err,
    method: req.method,
    path: req.originalUrl,
  });

  if (
    err instanceof PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({ error: "Duplicate entry" });
  }

  res.status(500).json({ error: "Internal server error" });
}
