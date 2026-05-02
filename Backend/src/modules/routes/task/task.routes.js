import express from "express";
import { assignTask, getMyTasks,getAssignedTasks,editTask,removeTask ,updateStatus} from "../../controller/task/task.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/assign", authMiddleware, assignTask);
router.get('/assigned', authMiddleware, getAssignedTasks);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.put("/update/:id", authMiddleware, editTask);
router.delete("/delete/:id", authMiddleware, removeTask);
router.put("/status/:id", authMiddleware, updateStatus);

export default router;