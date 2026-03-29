import { Request, Response } from "express";
import { prisma } from "../config/db";
import { logger } from "../logger";

export async function getHealth(req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "up",
    });
  } catch (error) {
    logger.error("Health check failed", { error });

    res.status(503).json({
      status: "unavailable",
      database: "down",
    });
  }
}
