import pool from "../../../config/db.js";

export const saveAIFeedbackRepo = async (
  employeeId,
  strengths,
  weaknesses,
  insights,
  growthPlan
) => {

  await pool.query(`
    INSERT INTO ai_feedback
    (
      employee_id,
      strengths,
      weaknesses,
      insights,
      growth_plan
    )
    VALUES (?, ?, ?, ?, ?)
  `, [
    employeeId,
    strengths,
    weaknesses,
    insights,
    growthPlan
  ]);

};