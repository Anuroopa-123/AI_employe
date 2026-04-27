import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Check if token is active in DB
  const [rows] = await pool.query(
  `SELECT * FROM user_sessions 
   WHERE user_id = ? 
   AND token = ? 
   AND is_active = TRUE
   AND expires_at > NOW()`,
  [decoded.id, token]
);

    if (!rows.length) {
      return res.status(401).json({
        message: "Session expired. Please login again"
      });
    }

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};