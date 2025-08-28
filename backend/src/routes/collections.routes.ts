import { Router } from "express";
import {
  createNewCollection,
  getCollectionById,
  getUserCollections,
  deleteCollectionById,
  editCollection,
} from "../controllers/collections.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/collections", authMiddleware, getUserCollections);

router.post(
  "/collections",
  authMiddleware,
  upload.single("image"),
  createNewCollection
);

router.put(
  "/collections/:collectionId",
  authMiddleware,
  upload.single("image"),
  editCollection
);

router.get("/collections/:collectionId", authMiddleware, getCollectionById);

router.delete(
  "/collections/:collectionId",
  authMiddleware,
  deleteCollectionById
);

export default router;
