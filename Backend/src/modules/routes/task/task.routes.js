import express from "express";
import { assignTask, getMyTasks,getAssignedTasks,editTask,removeTask ,updateStatus,reviewTask,addReview} from "../../controller/task/task.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/assign", authMiddleware, assignTask);
router.get('/assigned', authMiddleware, getAssignedTasks);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.put("/update/:id", authMiddleware, editTask);
router.delete("/delete/:id", authMiddleware, removeTask);
router.put("/status/:id", authMiddleware, updateStatus);
router.put("/review/:id", authMiddleware, reviewTask);
router.post("/review", authMiddleware, addReview);
export default router;