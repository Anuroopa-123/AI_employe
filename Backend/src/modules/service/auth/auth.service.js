import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../../../config/db.js";
import { createUser, findUserByEmail } from "../../repository/auth/auth.repository.js";

// REGISTER
export const registerUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10);

  // 1. Create user
  const result = await createUser(name, email, hashed);
  const userId = result.insertId;

  // 2. Create organization (for first user)
  const [orgResult] = await pool.query(
    "INSERT INTO organizations (name, created_by) VALUES (?, ?)",
    [`${name}'s Org`, userId]
  );

  const orgId = orgResult.insertId;

  // 3. Get Admin role
  const [role] = await pool.query(
    "SELECT id FROM roles WHERE name = 'Admin'"
  );

  const roleId = role[0].id;

  // 4. Map user → organization_users
  await pool.query(
    `INSERT INTO organization_users (user_id, organization_id, role_id)
     VALUES (?, ?, ?)`,
    [userId, orgId, roleId]
  );

  return true;
};

// LOGIN
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  //  1. GET ROLE FROM DB (THIS WAS MISSING)
  const [roleRow] = await pool.query(
    `SELECT r.name 
     FROM organization_users ou
     JOIN roles r ON ou.role_id = r.id
     WHERE ou.user_id = ?`,
    [user.id]
  );

  // Assign role
  user.role = roleRow[0]?.name || "Employee";

  //  2. DELETE OLD SESSION (clean)
  await pool.query("DELETE FROM user_sessions WHERE user_id = ?", [user.id]);

  //  3. CREATE TOKEN
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const sessionId = uuidv4();

  //  4. INSERT NEW SESSION
  await pool.query(
    `INSERT INTO user_sessions (user_id, token, session_id, is_active, expires_at)
     VALUES (?, ?, ?, TRUE, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
    [user.id, token, sessionId]
  );

  // 5. REMOVE PASSWORD
  delete user.password;

  return { token, user, sessionId };
};