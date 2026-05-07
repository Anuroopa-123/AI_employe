import express from "express";
import multer from "multer";

import {
  generateAIFeedback,
  chatWithAI,
  uploadKnowledgePDF
} from "../../controller/chatbot/chatbot.controller.js";

const router = express.Router();

router.get(
  "/feedback/:employeeId",
  generateAIFeedback
);

router.post('/chat', chatWithAI);
// const upload = multer({
//   dest: "uploads/"
// });
const storage = multer.diskStorage({ destination: (req, file, cb) => { cb(null, "uploads/"); }, filename: (req, file, cb) => { const uniqueName = `${Date.now()}_${file.originalname}`; cb(null, uniqueName); } }); const upload = multer({ storage });
// PDF UPLOAD
router.post(
  "/upload-pdf",
  upload.single("file"),
  uploadKnowledgePDF
);


export default router;

