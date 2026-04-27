import pool from "../config/db.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Get role from DB (dynamic)
      const [rows] = await pool.query(
        "SELECT r.name as role FROM organization_users ou JOIN roles r ON ou.role_id = r.id WHERE ou.user_id = ?",
        [userId]
      );

      if (!rows.length) {
        return res.status(403).json({ message: "User not part of organization" });
      }

      const userRole = rows[0].role;

      // Check allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access denied. Role '${userRole}' not allowed`
        });
      }

      // Attach role
      req.user.role = userRole;

      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};