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
  const [rows] = await pool.query(`
    SELECT 
      t.*,
      u.name AS employee_name,
      ou.employee_code,
      wl.attachment_url
    FROM tasks t
    JOIN organization_users ou ON t.assigned_to = ou.id
    JOIN users u ON ou.user_id = u.id
    LEFT JOIN work_logs wl 
      ON wl.task_id = t.id 
      AND wl.employee_id = ?
    WHERE t.assigned_to = ?
  `, [employeeId, employeeId]); //  FIXED

  return rows;
};

export const getMyTasks = async (req, res) => {
  try {
    console.log("Logged Employee Org ID:", req.user.orgUserId);

    const employeeId = req.user.orgUserId;

    const tasks = await getTasksForEmployee(employeeId);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//employee updated task status 
export const updateTaskStatus = async (taskId, status) => {
  await pool.query(
    `UPDATE tasks 
     SET status = ?, 
         completed_at = CASE WHEN ? = 'completed' THEN NOW() ELSE completed_at END,
         completion_status = 'pending'
     WHERE id = ?`,
    [status, status, taskId]
  );
};

export const getTasksByManager = async (managerId) => {
const [rows] = await pool.query(`
  SELECT 
    t.*,
    ou.employee_code,
    u.name AS employee_name,
    wl.attachment_url
  FROM tasks t
  JOIN organization_users ou ON t.assigned_to = ou.id
  JOIN users u ON ou.user_id = u.id
  LEFT JOIN work_logs wl 
    ON wl.task_id = t.id 
    AND wl.employee_id = ou.id
  WHERE t.created_by = ?
  ORDER BY t.created_at DESC
`, [managerId]);
  return rows;
};

export const updateTask = async (taskId, data) => {
  const { title, description, assigned_to, deadline } = data;

  await pool.query(
    `UPDATE tasks 
     SET title = ?, description = ?, assigned_to = ?, deadline = ?
     WHERE id = ?`,
    [title, description, assigned_to, deadline, taskId]
  );
};

export const deleteTask = async (taskId) => {
  await pool.query(`DELETE FROM tasks WHERE id = ?`, [taskId]);
};