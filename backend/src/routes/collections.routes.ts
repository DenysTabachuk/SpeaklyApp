import { Router } from "express";
import {
  createNewCollection,
  getUserCollections,
} from "../controllers/collections.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/collections", authMiddleware, createNewCollection);
router.get("/collections", authMiddleware, getUserCollections);

export default router;
