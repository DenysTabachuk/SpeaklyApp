import { Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";
import { logger } from "../logger";

export async function createNewCollection(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name) {
      return res.status(400).json({ error: "Collection name is required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newCollection = await prisma.collection.create({
      data: {
        name,
        description,
        userId: req.user.userId,
        imagePath,
      },
    });

    res.status(201).json(newCollection);
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
    new Promise((resolve) => setTimeout(resolve, 5000));

    const collections = await prisma.collection.findMany({
      where: { userId: req.user!.userId },
      orderBy: { id: "desc" },
    });

    res.status(200).json(collections);
  } catch (error) {
    next(error);
  }
}

export async function getCollectionById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const collectionId = parseInt(req.params.collectionId, 10);
  if (isNaN(collectionId)) {
    return res.status(400).json("Invalid collection ID");
  }

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      terms: {
        include: {
          definitions: true,
        },
      },
    },
  });

  if (!collection) {
    return res.status(404).json("Collection not found");
  }

  return res.status(200).json(collection);
}

export async function editCollection(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const collectionId = parseInt(req.params.collectionId, 10);
    if (isNaN(collectionId)) {
      return res.status(400).json({ error: "Invalid collection ID" });
    }

    const { name, description } = req.body;
    logger.info("Updating collection", {
      collectionId,
      name,
      hasDescription: Boolean(description),
    });
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (existingCollection.userId !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        name,
        description,
        ...(imagePath && { imagePath }),
      },
      include: {
        terms: {
          include: {
            definitions: true,
          },
        },
      },
    });

    logger.info("Collection updated", { collectionId: updatedCollection.id });
    res.status(200).json(updatedCollection);
  } catch (error) {
    next(error);
  }
}

export async function deleteCollectionById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const collectionId = parseInt(req.params.collectionId, 10);
    if (isNaN(collectionId)) {
      return res.status(400).json({ error: "Invalid collection ID" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (existingCollection.userId !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.collection.delete({
      where: { id: collectionId },
    });

    res.status(200).json("Collection deleted successfully");
  } catch (error) {
    next(error);
  }
}
