import express from "express";
import { getManagerStats } from "../../controller/manager/manager.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getManagerStats);

export default router;