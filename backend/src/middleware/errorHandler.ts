import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err);

  if (
    err instanceof PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({ error: "Duplicate entry" });
  }

  res.status(500).json({ error: "Internal server error" });
}
