import { Router } from "express";
import authRoutes from "./auth.routes";
import collectionRoutes from "./collections.routes";
import termRoutes from "./term.routes";

const router = Router();

router.use(authRoutes);
router.use(collectionRoutes);
router.use(termRoutes);

export default router;
