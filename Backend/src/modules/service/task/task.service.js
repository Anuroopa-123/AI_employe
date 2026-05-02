import pool from "../../../config/db.js";

export const createTask = async (task) => {
  const { title, description, assigned_to, created_by, deadline } = task;

  await pool.query(
    `INSERT INTO tasks 
     (title, description, assigned_to, created_by, status, deadline)
     VALUES (?, ?, ?, ?, 'pending', ?)`,
    [title, description, assigned_to, created_by, deadline]
  );
};

export const getTasksForEmployee = async (employeeId) => {
  const [rows] = await pool.query(
    `SELECT * FROM tasks WHERE assigned_to = ?`,
    [employeeId]
  );

  return rows;
};

export const getTasksByManager = async (managerId) => {
  const [rows] = await pool.query(`
    SELECT 
      t.*,
      ou.employee_code,
      u.name AS employee_name
    FROM tasks t
    JOIN organization_users ou ON t.assigned_to = ou.id
    JOIN users u ON ou.user_id = u.id
    WHERE t.created_by = ?
    ORDER BY t.created_at DESC
  `, [managerId]);

  return rows;
};