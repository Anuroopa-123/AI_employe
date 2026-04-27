import pool from "../../../config/db.js";
import { registerUser, loginUser } from "../../service/auth/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await registerUser(name, email, password);

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);

    res.json({ success: true, ...data });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({ success: true });
    }

    const token = authHeader.split(" ")[1];

    await pool.query(
      "DELETE FROM user_sessions WHERE token = ?",
      [token]
    );

    res.json({ success: true, message: "Logged out" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};