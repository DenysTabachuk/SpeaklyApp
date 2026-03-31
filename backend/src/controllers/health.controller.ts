import { Request, Response } from "express";
import { prisma } from "../config/db";
import { logger } from "../logger";

export async function getHealth(req: Request, res: Response) {
  try {
    // Лабораторна №0: health check: endpoint повертає 200 тільки якщо БД реально відповідає на запит.
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "up",
    });
  } catch (error) {
    logger.error("Health check failed", { error });

    // Якщо застосунок живий, але БД недоступна, повертаємо 503 згідно з вимогами лабораторної.
    res.status(503).json({
      status: "unavailable",
      database: "down",
    });
  }
}
