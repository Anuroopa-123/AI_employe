import pool from "../../../config/db.js";

export const getManagerStats = async (req, res) => {
  try {
    const orgUserId = req.user.orgUserId;

    //  TOP EMPLOYEES UNDER THIS MANAGER
    const [topEmployees] = await pool.query(`
      SELECT u.name, COUNT(*) as completed
      FROM tasks t
      JOIN organization_users ou ON t.assigned_to = ou.id
      JOIN users u ON ou.user_id = u.id
      WHERE t.created_by = ?
      AND t.status = 'completed'
      GROUP BY t.assigned_to
      ORDER BY completed DESC
      LIMIT 3
    `, [orgUserId]);

    res.json({
      topEmployees
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};