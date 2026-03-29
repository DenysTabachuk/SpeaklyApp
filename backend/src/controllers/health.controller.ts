import { Request, Response } from "express";
import { prisma } from "../config/db";

export async function getHealth(req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "up",
    });
  } catch (error) {
    console.error("Health check failed", error);

    res.status(503).json({
      status: "unavailable",
      database: "down",
    });
  }
}
