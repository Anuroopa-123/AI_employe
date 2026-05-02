import express from "express";
import { getAdminStats } from "../../controller/admin/admin.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getAdminStats);

export default router;