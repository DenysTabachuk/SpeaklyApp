import { Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

export async function createNewCollection(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Collection name is required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // console.log("user here: ", req.user);
    const newCollection = await prisma.collection.create({
      data: {
        name,
        description,
        userId: req.user.userId, // тепер TS знає, що user точно існує
      },
    });

    res.status(201).json({ collection: newCollection });
  } catch (error) {
    next(error);
  }
}

export async function getUserCollections(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const collections = await prisma.collection.findMany({
      where: { userId: req.user.userId },
      orderBy: { id: "desc" },
    });

    res.status(200).json({ collections });
  } catch (error) {
    next(error);
  }
}
