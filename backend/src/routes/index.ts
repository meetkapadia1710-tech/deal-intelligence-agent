import { Router } from "express";
import dealRoutes from "./deal.routes.js";
import chatRoutes from "./chat.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();
router.use("/", dealRoutes);
router.use("/", chatRoutes);
router.use("/", authRoutes);

export default router;
