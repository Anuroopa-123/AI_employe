import pool from "../../../config/db.js";

export const createTask = async (task) => {
  const { title, description, assigned_to, created_by, deadline, priority } = task;

  await pool.query(
    `INSERT INTO tasks 
     (title, description, assigned_to, created_by, status, deadline, priority)
     VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
    [
      title,
      description,
      assigned_to,
      created_by,
      deadline,
      priority || 'low' // default
    ]
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
LEFT JOIN (
  SELECT task_id, MAX(attachment_url) as attachment_url
  FROM work_logs
  GROUP BY task_id
) wl ON wl.task_id = t.id
  WHERE t.assigned_to = ?
  ORDER BY 
    CASE 
      WHEN t.status = 'pending' THEN 1
      WHEN t.status = 'in_progress' THEN 2
      WHEN t.status = 'completed' THEN 3
    END,
    t.order_index ASC
`, [employeeId, employeeId]);

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
LEFT JOIN (
  SELECT task_id, MAX(attachment_url) as attachment_url
  FROM work_logs
  GROUP BY task_id
) wl ON wl.task_id = t.id
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

  //  1. Delete dependent work logs FIRST
  await pool.query(`DELETE FROM work_logs WHERE task_id = ?`, [taskId]);

  // 2. Delete reviews (if exists)
  await pool.query(`DELETE FROM reviews WHERE task_id = ?`, [taskId]);

  // . Now delete task
  await pool.query(`DELETE FROM tasks WHERE id = ?`, [taskId]);
};