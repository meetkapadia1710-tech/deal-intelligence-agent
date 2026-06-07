import { Router } from "express";
import dealRoutes from "./deal.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();
router.use("/", dealRoutes);
router.use("/", chatRoutes);

export default router;
