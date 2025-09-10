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
        userId: req.user.userId, // тепер TS знає, що user точно існує
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
    // щоб одразу підтягувати терміни та їх визначення
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
    console.log("name, description", name, description);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined; // undefined, щоб не перезаписувати якщо нема

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Перевіряємо, чи колекція існує та належить користувачу
    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (existingCollection.userId !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Оновлюємо колекцію і відразу включаємо терміни та визначення
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

    console.log("updatedCollection", updatedCollection);
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

    // Перевіряємо, чи колекція існує та належить користувачу
    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!existingCollection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    if (existingCollection.userId !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Видаляємо колекцію (разом з термінами та визначеннями, якщо cascade налаштовано)
    await prisma.collection.delete({
      where: { id: collectionId },
    });

    res.status(200).json("Collection deleted successfully");
  } catch (error) {
    next(error);
  }
}
