import pool from "../../../config/db.js";
import bcrypt from "bcrypt";

// GET EMPLOYEES
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, r.name AS role
      FROM users u
      JOIN organization_users ou ON u.id = ou.user_id
      JOIN roles r ON ou.role_id = r.id
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD EMPLOYEE
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    // 1. create user
    const [userResult] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    const userId = userResult.insertId;

    // 2. assign organization + role
    await pool.query(
      `INSERT INTO organization_users (user_id, organization_id, role_id)
       VALUES (?, 1, ?)`, //  for now org_id = 1
      [userId, role_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ROLE
export const updateRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;

    await pool.query(
      "UPDATE organization_users SET role_id = ? WHERE user_id = ?",
      [role_id, user_id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};