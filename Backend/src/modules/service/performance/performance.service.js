import pool from "../../../config/db.js";

export const calculatePerformanceScore = async (employeeId) => {

  // ===============================
  // 1. CALCULATE METRICS
  // ===============================

  const [totalTasksRows] = await pool.query(`
    SELECT COUNT(*) as total FROM tasks WHERE assigned_to = ?
  `, [employeeId]);
  const totalTasks = totalTasksRows[0].total || 0;

  const [completedRows] = await pool.query(`
    SELECT COUNT(*) as completed FROM tasks 
    WHERE assigned_to = ? AND status = 'completed'
  `, [employeeId]);
  const completedTasks = completedRows[0].completed || 0;

  const productivityScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const [worklogRows] = await pool.query(`
    SELECT COUNT(DISTINCT DATE(work_date)) as days_logged 
    FROM work_logs WHERE employee_id = ?
  `, [employeeId]);
  const daysLogged = worklogRows[0].days_logged || 0;
  const consistencyScore = (daysLogged / 22) * 100;   // 22 working days

  const [deadlineRows] = await pool.query(`
    SELECT COUNT(*) as on_time FROM tasks 
    WHERE assigned_to = ? AND status = 'completed' AND completed_at <= deadline
  `, [employeeId]);
  const onTimeTasks = deadlineRows[0].on_time || 0;
  const deadlineScore = completedTasks > 0 ? (onTimeTasks / completedTasks) * 100 : 0;

  const [ratingRows] = await pool.query(`
    SELECT AVG(rating) as avg_rating FROM reviews WHERE employee_id = ?
  `, [employeeId]);
  const avgRating = ratingRows[0].avg_rating || 0;
  const managerRatingAvg = (avgRating / 5) * 100;

  const finalScore = 
    (productivityScore * 0.35) +
    (consistencyScore * 0.20) +
    (deadlineScore * 0.25) +
    (managerRatingAvg * 0.20);

  // ===============================
  // 2. SAVE / UPDATE (Only Latest Record)
  // ===============================

  await pool.query(`
    INSERT INTO performance_metrics 
    (employee_id, productivity_score, consistency_score, 
     deadline_score, manager_rating_avg, final_score)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      productivity_score = VALUES(productivity_score),
      consistency_score = VALUES(consistency_score),
      deadline_score = VALUES(deadline_score),
      manager_rating_avg = VALUES(manager_rating_avg),
      final_score = VALUES(final_score),
      calculated_at = CURRENT_TIMESTAMP
  `, [
    employeeId,
    productivityScore,
    consistencyScore,
    deadlineScore,
    managerRatingAvg,
    finalScore
  ]);

  return {
    productivityScore: Math.round(productivityScore),
    consistencyScore: Math.round(consistencyScore),
    deadlineScore: Math.round(deadlineScore),
    managerRatingAvg: Math.round(managerRatingAvg),
    finalScore: Math.round(finalScore)
  };
};