import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/db";
import { logger } from "../logger";

export async function addNewTerm(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { word, definitions, collectionId } = req.body;

    if (!word || typeof word !== "string") {
      return res.status(400).json({ error: "Pole 'word' ye oboviazkovym" });
    }

    const collection = await prisma.collection.findUnique({
      where: { id: Number(collectionId) },
    });

    if (!collection) {
      return res.status(404).json({ error: "Kolektsiiu ne znaideno" });
    }

    if (collection.userId !== req.user!.userId) {
      return res.status(403).json({ error: "Nemaie dostupu do tsiiei kolektsii" });
    }

    logger.info("Creating term", {
      collectionId: Number(collectionId),
      definitionsCount: Array.isArray(definitions) ? definitions.length : 0,
    });

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
    logger.error("Failed to create term", { error });
    return res.status(500).json({ error: "Ne vdalosia stvoryty termin" });
  }
}

export async function deleteTerm(req: AuthRequest, res: Response) {
  try {
    const collectionId = Number(req.params.collectionId);
    const termId = Number(req.params.termId);

    if (!termId) {
      return res.status(400).json({ error: "termId is required" });
    }

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

    await prisma.term.delete({
      where: { id: termId },
    });

    return res.status(200).json("Term deleted successfully");
  } catch (error) {
    logger.error("Failed to delete term", {
      error,
      collectionId: Number(req.params.collectionId),
      termId: Number(req.params.termId),
    });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function editTerm(req: AuthRequest, res: Response) {
  try {
    const collectionId = Number(req.params.collectionId);
    const termId = Number(req.params.termId);

    const updatedWord = req.body.word;
    const updatedDefinitions = req.body.definitions;

    if (!termId) {
      return res.status(400).json({ error: "termId is required" });
    }

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

    const updated = await prisma.term.update({
      where: { id: termId },
      data: {
        word: updatedWord,
        definitions: {
          deleteMany: {},
          create: updatedDefinitions.map((d) => ({ text: d.text })),
        },
      },
      include: { definitions: true },
    });

    return res.status(200).json(updated);
  } catch (error) {
    logger.error("Failed to edit term", {
      error,
      collectionId: Number(req.params.collectionId),
      termId: Number(req.params.termId),
    });
    return res.status(500).json({ error: "Internal server error" });
  }
}
