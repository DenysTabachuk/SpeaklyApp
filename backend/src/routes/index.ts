import { Router } from "express";
import authRoutes from "./auth.routes";
import collectionRoutes from "./collections.routes";

const router = Router();

router.use(authRoutes);
router.use(collectionRoutes);

export default router;
