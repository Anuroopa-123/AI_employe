
import pool from "../../../config/db.js";
export const getAdminStats = async (req, res) => {
  try {
    const orgId = req.user.organizationId;

   const [[employees]] = await pool.query(
     `
  SELECT COUNT(*) as total
  FROM organization_users ou
  JOIN roles r ON ou.role_id = r.id
  WHERE r.name = 'Employee' AND ou.organization_id = ?
`,
     [orgId],
   );

   const [[managers]] = await pool.query(
     `
  SELECT COUNT(*) as total
  FROM organization_users ou
  JOIN roles r ON ou.role_id = r.id
  WHERE r.name = 'Manager' AND ou.organization_id = ?
`,
     [orgId],
   );
 const [[tasks]] = await pool.query(`
  SELECT COUNT(*) as total
  FROM tasks t
  JOIN organization_users ou ON t.created_by = ou.id
  WHERE ou.organization_id = ?
`, [orgId]);

const [[urgent]] = await pool.query(`
  SELECT COUNT(*) as total 
  FROM tasks t
  JOIN organization_users ou ON t.created_by = ou.id
  WHERE ou.organization_id = ?
  AND t.deadline <= DATE_ADD(NOW(), INTERVAL 2 DAY)
  AND t.status != 'completed'
`, [orgId]);

    const [topEmployees] = await pool.query(`
      SELECT u.name, COUNT(*) as completed
      FROM tasks t
      JOIN organization_users ou ON t.assigned_to = ou.id
      JOIN users u ON ou.user_id = u.id
      WHERE t.status = 'completed'
      GROUP BY t.assigned_to
      ORDER BY completed DESC
      LIMIT 3
    `);

    const [topManagers] = await pool.query(`
      SELECT u.name, COUNT(*) as assigned
      FROM tasks t
      JOIN organization_users ou ON t.created_by = ou.id
      JOIN users u ON ou.user_id = u.id
      GROUP BY t.created_by
      ORDER BY assigned DESC
      LIMIT 3
    `);

    res.json({
      totalEmployees: employees.total,
      totalManagers: managers.total,
      totalTasks: tasks.total,
      urgentTasks: urgent.total,
      topEmployees,
      topManagers
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};