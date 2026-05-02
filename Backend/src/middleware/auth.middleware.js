import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    //  1. VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  2. CHECK SESSION
    const [rows] = await pool.query(
      `SELECT * FROM user_sessions 
       WHERE user_id = ? 
       AND token = ? 
       AND expires_at > NOW()`,
      [decoded.id, token]
    );

    if (!rows.length) {
      await pool.query("DELETE FROM user_sessions WHERE token = ?", [token]);

      return res.status(401).json({
        message: "Session expired",
      });
    }

    //  3. GET ORGANIZATION USER ID 
 const [orgUser] = await pool.query(
  "SELECT id, organization_id FROM organization_users WHERE user_id = ?",
  [decoded.id]
);
    if (!orgUser.length) {
      return res.status(401).json({
        message: "Org user not found",
      });
    }

    //  4. ATTACH EVERYTHING TO REQUEST
    req.user = decoded;
    req.user.orgUserId = orgUser[0].id;
    req.user.organizationId = orgUser[0].organization_id;

    // (optional but useful)
    req.sessionData = rows[0];

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};