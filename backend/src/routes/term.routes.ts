import { Router } from "express";
import { addNewTerm } from "../controllers/term.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/collections/:collectionId/terms", authMiddleware, addNewTerm);

export default router;
