import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../../../config/db.js";
import { createUser, findUserByEmail } from "../../repository/auth/auth.repository.js";

// REGISTER
export const registerUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return await createUser(name, email, hashed);
};

// LOGIN
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  //  1. DEACTIVATE ALL OLD SESSIONS
  await pool.query(
    "UPDATE user_sessions SET is_active = FALSE WHERE user_id = ?",
    [user.id]
  );

  //  2. CREATE NEW TOKEN
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const sessionId = uuidv4();

  // 3. INSERT NEW SESSION
  await pool.query(
    `INSERT INTO user_sessions (user_id, token, session_id, is_active, expires_at)
     VALUES (?, ?, ?, TRUE, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
    [user.id, token, sessionId]
  );

  // 4. REMOVE PASSWORD
  delete user.password;

  return { token, user };
};