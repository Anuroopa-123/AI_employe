import express from "express";

import {
  generateAIFeedback
} from "../../controller/chatbot/chatbot.controller.js";

const router = express.Router();

router.get(
  "/feedback/:employeeId",
  generateAIFeedback
);

export default router;