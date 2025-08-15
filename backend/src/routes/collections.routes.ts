import { Router } from "express";
import {
  createNewCollection,
  getCollectionById,
  getUserCollections,
} from "../controllers/collections.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/collections", authMiddleware, createNewCollection);
router.get("/collections", authMiddleware, getUserCollections);
router.get("/collections/:collectionId", authMiddleware, getCollectionById);

export default router;
