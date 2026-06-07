import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { validateRequest, ChatRequestSchema, ReflectRequestSchema } from "../utils/validation.js";

const router = Router();
router.post("/chat", validateRequest(ChatRequestSchema), chatController.handleChat);
router.post("/chat-no-memory", validateRequest(ChatRequestSchema), chatController.handleChatNoMemory);
router.post("/compare", validateRequest(ChatRequestSchema), chatController.handleCompare);
router.post("/reflect", validateRequest(ReflectRequestSchema), chatController.handleReflect);

export default router;
