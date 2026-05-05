import pool from "../../../config/db.js";
import { createTask, getTasksForEmployee, getTasksByManager,updateTask, deleteTask , updateTaskStatus} 
from "../../service/task/task.service.js";

export const assignTask = async (req, res) => {
  try {
    const managerId = req.user.orgUserId; 
    
    console.log("Manager ID:", managerId); // from middleware

    await createTask({
      ...req.body,
      created_by: managerId
    });

    res.json({ success: true, message: "Task assigned" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }

};

//employee updated task status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await updateTaskStatus(id, status);

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const employeeId = req.user.orgUserId;

    const tasks = await getTasksForEmployee(employeeId);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAssignedTasks = async (req, res) => {
  try {
    const managerId = req.user.orgUserId;

    const tasks = await getTasksByManager(managerId);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;

    await updateTask(id, req.body);

    res.json({ success: true, message: "Task updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const removeTask = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteTask(id);

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reviewTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completion_status } = req.body;

    if (completion_status === 'rejected') {
      await pool.query(`
        UPDATE tasks 
        SET completion_status = 'rejected',
            status = 'in_progress',   --  RESET TASK
            completed_at = NULL       -- CLEAR COMPLETION
        WHERE id = ?
      `, [id]);
    } else {
      await pool.query(`
        UPDATE tasks 
        SET completion_status = 'approved'
        WHERE id = ?
      `, [id]);
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addReview = async (req, res) => {
  try {
    const reviewerId = req.user.orgUserId;
    const { task_id, employee_id, rating, comments } = req.body;

    await pool.query(
      `INSERT INTO reviews (employee_id, reviewer_id, task_id, rating, comments)
       VALUES (?, ?, ?, ?, ?)`,
      [employee_id, reviewerId, task_id, rating, comments]
    );

    res.json({ success: true, message: "Review added" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const tasks = req.body;

    for (const t of tasks) {
      await pool.query(
        `UPDATE tasks SET order_index = ? WHERE id = ?`,
        [t.order_index, t.id]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};