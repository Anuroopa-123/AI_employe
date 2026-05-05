import pool from "../../../config/db.js";
import bcrypt from "bcrypt";
import { getProfileService, updateProfileService } 
from "../../service/organization/org.service.js";
// GET EMPLOYEES
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.name, 
        u.email,
        u.status,
        ou.id AS org_user_id,
        ou.employee_code,  
        r.name AS role
      FROM organization_users ou
      JOIN users u ON ou.user_id = u.id
      JOIN roles r ON ou.role_id = r.id
      WHERE r.name = 'Employee'
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

    // 2. insert into organization_users
    const [orgResult] = await pool.query(
      `INSERT INTO organization_users (user_id, organization_id, role_id)
       VALUES (?, 1, ?)`,
      [userId, role_id]
    );

    const orgUserId = orgResult.insertId; //  IMPORTANT

    // 3. GENERATE EMPLOYEE CODE
    const [countRows] = await pool.query(
      "SELECT COUNT(*) as count FROM organization_users"
    );

    const empNumber = countRows[0].count;

    const employeeCode = `EMP${String(empNumber).padStart(3, '0')}`;

    // 4. UPDATE employee_code
    await pool.query(
      "UPDATE organization_users SET employee_code = ? WHERE id = ?",
      [employeeCode, orgUserId] //  USE id (NOT user_id)
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

export const toggleUserStatus = async (req, res) => {
  const { user_id, status } = req.body;

  await pool.query(
    "UPDATE users SET status = ? WHERE id = ?",
    [status, user_id]
  );

  res.json({ success: true });
};

// PROFILE - GET
export const getProfile = async (req, res) => {
  try {
    const orgUserId = req.user.orgUserId;

    const profile = await getProfileService(orgUserId);

    res.json(profile);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// PROFILE - UPDATE
export const updateProfile = async (req, res) => {
  try {
    const orgUserId = req.user.orgUserId;

    await updateProfileService(orgUserId, req.body);

    res.json({ success: true, message: "Profile updated" });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};