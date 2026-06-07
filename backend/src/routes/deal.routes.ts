import { Router } from "express";
import * as dealController from "../controllers/deal.controller.js";
import { validateRequest, LogInteractionSchema } from "../utils/validation.js";

const router = Router();
router.get("/deals", dealController.listDeals);
router.post("/interactions", validateRequest(LogInteractionSchema), dealController.logInteraction);
router.get("/interactions/:dealId/context", dealController.getContext);
router.get("/timeline/:dealId", dealController.getTimeline);
router.get("/next-action/:dealId", dealController.getNextAction);
router.post("/seed", dealController.seedDemoData);

export default router;
