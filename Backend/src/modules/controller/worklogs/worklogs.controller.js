import pool from "../../../config/db.js";

export const addWorkLog = async (req, res) => {
  try {
    const employeeId = req.user.orgUserId;

    const { task_id, description, hours_spent } = req.body;

    const fileUrl = req.file ? req.file.filename : null;

    // ✅ CHECK if log already exists
    const [existing] = await pool.query(`
      SELECT id FROM work_logs 
      WHERE employee_id = ? AND task_id = ?
    `, [employeeId, task_id]);

    if (existing.length > 0) {
      // 🔥 UPDATE existing log (NO duplicate cards)
      await pool.query(`
        UPDATE work_logs
        SET description = ?, 
            hours_spent = ?, 
            work_date = CURDATE(),
            attachment_url = COALESCE(?, attachment_url)
        WHERE employee_id = ? AND task_id = ?
      `, [description, hours_spent || 0, fileUrl, employeeId, task_id]);

    } else {
      // ✅ INSERT first time
      await pool.query(`
        INSERT INTO work_logs 
        (employee_id, task_id, description, hours_spent, work_date, attachment_url)
        VALUES (?, ?, ?, ?, CURDATE(), ?)
      `, [employeeId, task_id, description, hours_spent || 0, fileUrl]);
    }

    // ✅ RESET TASK STATUS (VERY IMPORTANT)
    await pool.query(`
      UPDATE tasks 
      SET completion_status = 'pending',
          status = 'in_progress'
      WHERE id = ?
    `, [task_id]);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyWorkLogs = async (req, res) => {
  try {
    const employeeId = req.user.orgUserId;

    const [rows] = await pool.query(`
      SELECT wl.*, t.title
      FROM work_logs wl
      JOIN tasks t ON wl.task_id = t.id
      WHERE wl.employee_id = ?
      ORDER BY wl.work_date DESC
    `, [employeeId]);

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateWorkLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, hours_spent } = req.body;

    const [rows] = await pool.query(`
      SELECT * FROM work_logs WHERE id = ?
    `, [id]);

    const log = rows[0];

    const today = new Date().toISOString().split('T')[0];
    const logDate = new Date(log.work_date).toISOString().split('T')[0];

    if (today !== logDate) {
      return res.status(403).json({ message: "Can edit only today logs" });
    }

    await pool.query(`
      UPDATE work_logs 
      SET description = ?, hours_spent = ?
      WHERE id = ?
    `, [description, hours_spent, id]);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteWorkLog = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT * FROM work_logs WHERE id = ?
    `, [id]);

    const log = rows[0];

    const today = new Date().toISOString().split('T')[0];
    const logDate = new Date(log.work_date).toISOString().split('T')[0];

    if (today !== logDate) {
      return res.status(403).json({ message: "Cannot delete old logs" });
    }

    await pool.query(`DELETE FROM work_logs WHERE id = ?`, [id]);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

