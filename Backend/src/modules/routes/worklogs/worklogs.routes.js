import express from "express";
import {
  addWorkLog,
  getMyWorkLogs,
  updateWorkLog,
  deleteWorkLog
} from "../../controller/worklogs/worklogs.controller.js";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import upload from "../../../middleware/upload.middleware.js";

const router = express.Router();

//  EXISTING
router.post("/add", authMiddleware, upload.single("file"), addWorkLog);

//  ADD THESE (MOST IMPORTANT)
router.get("/my", authMiddleware, getMyWorkLogs);
router.put("/:id", authMiddleware, updateWorkLog);
router.delete("/:id", authMiddleware, deleteWorkLog);

export default router;