import express from "express";
import {
  getEmployees,
  addEmployee,
  updateRole,
  toggleUserStatus,
  getProfile,
  updateProfile
} from "../../controller/organization/org.controller.js";


import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/employees", authMiddleware, getEmployees);
router.post("/add-employee", authMiddleware, addEmployee);
router.post("/update-role", authMiddleware, updateRole);
router.post("/toggle-status", authMiddleware, toggleUserStatus);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
export default router;