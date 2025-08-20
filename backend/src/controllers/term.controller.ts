import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/db";

export async function addNewTerm(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { collectionId } = req.params;
    const { word, definitions } = req.body;

    if (!word || typeof word !== "string") {
      return res.status(400).json({ error: "Поле 'word' є обов'язковим" });
    }

    // Перевіряємо, чи колекція належить користувачу
    const collection = await prisma.collection.findUnique({
      where: { id: Number(collectionId) },
    });

    if (!collection) {
      return res.status(404).json({ error: "Колекція не знайдена" });
    }

    if (collection.userId !== req.user!.userId) {
      return res.status(403).json({ error: "Немає доступу до цієї колекції" });
    }

    // Створюємо термін і визначення
    const newTerm = await prisma.term.create({
      data: {
        word,
        collection: { connect: { id: Number(collectionId) } },
        definitions: definitions
          ? {
              create: definitions.map((text: string) => ({
                text,
              })),
            }
          : undefined,
      },
      include: { definitions: true }, // щоб повернути нові визначення
    });

    return res.status(201).json(newTerm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не вдалося створити термін" });
  }
}
