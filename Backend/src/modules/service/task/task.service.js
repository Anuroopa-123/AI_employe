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