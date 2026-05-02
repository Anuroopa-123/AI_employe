import express from "express";
import { assignTask, getMyTasks,getAssignedTasks } from "../../controller/task/task.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/assign", authMiddleware, assignTask);
router.get('/assigned', authMiddleware, getAssignedTasks);
router.get("/my-tasks", authMiddleware, getMyTasks);

export default router;