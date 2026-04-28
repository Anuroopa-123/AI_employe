import express from "express";
import {
  getEmployees,
  addEmployee,
  updateRole
} from "../../controller/organization/org.controller.js";


import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/employees", authMiddleware, getEmployees);
router.post("/add-employee", authMiddleware, addEmployee);
router.post("/update-role", authMiddleware, updateRole);

export default router;