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
      model: "mistral",        // or "llama3"  "llama2"
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


export const chatService = async (data) => {

  const { employeeId, question } = data;

  // =========================
  // EMPLOYEE PROFILE
  // =========================

  const [profileRows] = await pool.query(`
    SELECT
      u.name,
      ou.department,
      ou.designation,
      ou.skills

    FROM organization_users ou

    JOIN users u
    ON ou.user_id = u.id

    WHERE ou.id = ?
  `, [employeeId]);



  // =========================
  // TASKS
  // =========================

  const [tasks] = await pool.query(`
    SELECT
      title,
      status,
      priority

    FROM tasks

    WHERE assigned_to = ?

    LIMIT 10
  `, [employeeId]);



  // =========================
  // WORKLOGS
  // =========================

  const [worklogs] = await pool.query(`
    SELECT
      description,
      hours_spent

    FROM work_logs

    WHERE employee_id = ?

    LIMIT 10
  `, [employeeId]);



  // =========================
  // PERFORMANCE
  // =========================

  const [metrics] = await pool.query(`
    SELECT *

    FROM performance_metrics

    WHERE employee_id = ?

    ORDER BY calculated_at DESC

    LIMIT 1
  `, [employeeId]);



  // =========================
  // CHAT HISTORY
  // =========================

  const [history] = await pool.query(`
    SELECT
      role,
      message

    FROM ai_chat_history

    WHERE employee_id = ?

    ORDER BY created_at DESC

    LIMIT 10
  `, [employeeId]);



  // =========================
  // AI PROMPT
  // =========================

  const context = `

EMPLOYEE:
${JSON.stringify(profileRows)}

TASKS:
${JSON.stringify(tasks)}

WORKLOGS:
${JSON.stringify(worklogs)}

PERFORMANCE:
${JSON.stringify(metrics)}

CHAT HISTORY:
${JSON.stringify(history)}

CURRENT QUESTION:
${question}

RULES:
- Answer professionally
- Use employee data
- Keep concise
- If no data exists say clearly
- Remember previous conversation context

`;



  // =========================
  // OLLAMA AI CALL
  // =========================

  const response =
    await ollama.post('/api/generate', {

      model: 'mistral',

      prompt: context,

      stream: false,

      temperature: 0.3

    });



  // =========================
  // AI RESPONSE
  // =========================

  const aiText = response.data.response;



  // =========================
  // SAVE USER MESSAGE
  // =========================

  await pool.query(`
    INSERT INTO ai_chat_history
    (employee_id, role, message)

    VALUES (?, ?, ?)
  `, [
    employeeId,
    'user',
    question
  ]);



  // =========================
  // SAVE AI MESSAGE
  // =========================

  await pool.query(`
    INSERT INTO ai_chat_history
    (employee_id, role, message)

    VALUES (?, ?, ?)
  `, [
    employeeId,
    'assistant',
    aiText
  ]);



  // =========================
  // RETURN RESPONSE
  // =========================

  return {
    answer: aiText
  };

};