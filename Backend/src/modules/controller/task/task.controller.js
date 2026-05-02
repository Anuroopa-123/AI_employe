import { createTask, getTasksForEmployee, getTasksByManager,updateTask, deleteTask } 
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