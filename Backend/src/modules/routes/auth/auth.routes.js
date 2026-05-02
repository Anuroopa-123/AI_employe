import express from "express";
import { register, login,logout,checkRegistration } from "../../controller/auth/auth.controller.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check-session", authMiddleware, (req, res) => {
  res.json({ success: true });
});
router.get("/check-register", checkRegistration);
export default router;