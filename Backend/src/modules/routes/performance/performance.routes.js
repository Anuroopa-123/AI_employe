import express from "express";

import {
  generatePerformance
} from "../../controller/performance/performance.controller.js";

import { authMiddleware }
from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/generate/:employeeId",
  authMiddleware,
  generatePerformance
);

export default router;