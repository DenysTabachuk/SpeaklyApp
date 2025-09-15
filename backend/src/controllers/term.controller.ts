import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/db";

export async function addNewTerm(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { word, definitions, collectionId } = req.body;

    if (!word || typeof word !== "string") {
      return res.status(400).json({ error: "Поле 'word' є обов'язковим" });
    }

    const collection = await prisma.collection.findUnique({
      where: { id: Number(collectionId) },
    });

    if (!collection) {
      return res.status(404).json({ error: "Колекція не знайдена" });
    }

    if (collection.userId !== req.user!.userId) {
      return res.status(403).json({ error: "Немає доступу до цієї колекції" });
    }

    console.log("definitions", definitions);

    // Перетворюємо definitions у правильний формат для Prisma
    const defsForPrisma =
      definitions && definitions.length > 0
        ? (definitions as any[]).map((def) =>
            typeof def === "string" ? { text: def } : { text: def.text }
          )
        : undefined;

    const newTerm = await prisma.term.create({
      data: {
        word,
        collection: { connect: { id: Number(collectionId) } },
        definitions: defsForPrisma ? { create: defsForPrisma } : undefined,
      },
      include: { definitions: true },
    });

    return res.status(201).json(newTerm);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Не вдалося створити термін" });
  }
}

export async function deleteTerm(req: AuthRequest, res: Response) {
  try {
    const collectionId = Number(req.params.collectionId);
    const termId = Number(req.params.termId);

    if (!termId) {
      return res.status(400).json({ error: "termId is required" });
    }
    // Перевіримо, чи термін взагалі належить до колекції користувача
    const term = await prisma.term.findUnique({
      where: { id: termId },
      include: { collection: true },
    });

    if (!term) {
      return res.status(404).json({ error: "Term not found" });
    }

    if (term.collectionId !== collectionId) {
      return res.status(403).json({ error: "You cannot delete this term" });
    }

    // Видаляємо термін (cascade для визначень, якщо налаштовано у Prisma)
    await prisma.term.delete({
      where: { id: termId },
    });

    return res.status(200).json("Term deleted successfully");
  } catch (error) {
    console.error("Error deleting term:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function editTerm(req: AuthRequest, res: Response) {
  try {
    const collectionId = Number(req.params.collectionId);
    const termId = Number(req.params.termId);

    const updatedWord = req.body.word;
    const updatedDefinitions = req.body.definitions; // [{ text }]

    if (!termId) {
      return res.status(400).json({ error: "termId is required" });
    }

    // Перевірка, чи термін належить до колекції користувача
    const term = await prisma.term.findUnique({
      where: { id: termId },
      include: { collection: true, definitions: true },
    });

    if (!term) {
      return res.status(404).json({ error: "Term not found" });
    }

    if (term.collectionId !== collectionId) {
      return res.status(403).json({ error: "You cannot edit this term" });
    }

    if (!updatedWord || !Array.isArray(updatedDefinitions)) {
      return res.status(400).json({ error: "New term structure is required" });
    }

    //  Видаляємо старі визначення і додаємо нові
    const updated = await prisma.term.update({
      where: { id: termId },
      data: {
        word: updatedWord,
        definitions: {
          deleteMany: {}, // видаляє всі визначення цього терміну
          create: updatedDefinitions.map((d) => ({ text: d.text })),
        },
      },
      include: { definitions: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error editing term:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
