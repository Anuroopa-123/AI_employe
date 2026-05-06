import pool from "../../../config/db.js";
import { ollama } from "../../../config/ai.config.js";
import { buildPerformancePrompt } from "./prompt.service.js";
import { saveAIFeedbackRepo } from "../../repository/chatbot/chatbot.repository.js";

export const generateEmployeeFeedback = async (employeeId) => {
  try {
    // Get Employee Data
    const [profileRows] = await pool.query(`
      SELECT u.name, ou.department, ou.designation, ou.skills 
      FROM organization_users ou
      JOIN users u ON ou.user_id = u.id
      WHERE ou.id = ?
    `, [employeeId]);

    const [metricRows] = await pool.query(`
      SELECT * FROM performance_metrics 
      WHERE employee_id = ? 
      ORDER BY calculated_at DESC LIMIT 1
    `, [employeeId]);
    const [tasks] = await pool.query(`
SELECT title, status, priority
FROM tasks
WHERE assigned_to = ?
LIMIT 5
`, [employeeId]);

const [worklogs] = await pool.query(`
SELECT description, hours_spent
FROM work_logs
WHERE employee_id = ?
LIMIT 5
`, [employeeId]);

const [reviews] = await pool.query(`
SELECT rating, comments
FROM reviews
WHERE employee_id = ?
LIMIT 5
`, [employeeId]);

    const profile = profileRows[0] || {};
    const metrics = metricRows[0] || {};

    const prompt = buildPerformancePrompt({ ...profile, ...metrics,  tasks: JSON.stringify(tasks),
  worklogs: JSON.stringify(worklogs),
  reviews: JSON.stringify(reviews) });

    // Call Ollama
    const response = await ollama.post("/api/generate", {
      model: "mistral",        // or "llama3" if you have it
      prompt: prompt,
      stream: false,
      temperature: 0.7
    });

    const aiText = response.data.response || "No response from AI";

    // Save to DB
    await saveAIFeedbackRepo(employeeId, aiText, "", "", "");

    return {
      success: true,
      aiFeedback: aiText
    };

  } catch (err) {
    console.error("AI Feedback Error:", err.message);
    
    return {
      success: false,
      message: "AI is taking too long. Please try again later.",
      aiFeedback: "⚠️ AI generation timed out. Try again in a few moments."
    };
  }
};