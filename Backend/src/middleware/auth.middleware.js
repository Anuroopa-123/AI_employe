import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await pool.query(
      `SELECT * FROM user_sessions 
   WHERE user_id = ? 
   AND token = ? 
   AND expires_at > NOW()`,
      [decoded.id, token],
    );

    if (!rows.length) {
      // DELETE EXPIRED / INVALID TOKEN
      await pool.query("DELETE FROM user_sessions WHERE token = ?", [token]);

      return res.status(401).json({
        message: "Session expired",
      });
    }

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};