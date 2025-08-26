import { Router } from "express";
import {
  addNewTerm,
  deleteTerm,
  editTerm,
} from "../controllers/term.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/collections/:collectionId/terms", authMiddleware, addNewTerm);

router.delete(
  "/collections/:collectionId/terms/:termId",
  authMiddleware,
  deleteTerm
);

router.put(
  "/collections/:collectionId/terms/:termId",
  authMiddleware,
  editTerm
);

export default router;
