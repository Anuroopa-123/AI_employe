import express from "express";

import {
  generateAIFeedback,
  chatWithAI
} from "../../controller/chatbot/chatbot.controller.js";

const router = express.Router();

router.get(
  "/feedback/:employeeId",
  generateAIFeedback
);

router.post('/chat', chatWithAI);

export default router;