import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import pool from "../../../config/db.js";
import { createUser, findUserByEmail } from "../../repository/auth/auth.repository.js"; // 🔥 IMPORTANT

//  REGISTER
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

  //  deactivate old sessions
//  Check if session already exists
const [existing] = await pool.query(
  "SELECT * FROM user_sessions WHERE user_id = ?",
  [user.id]
);

const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const sessionId = uuidv4();

if (existing.length > 0) {
  //  UPDATE SAME ROW
  await pool.query(
    `UPDATE user_sessions 
     SET token = ?, session_id = ?, is_active = TRUE, 
         expires_at = DATE_ADD(NOW(), INTERVAL 1 DAY),
         created_at = NOW()
     WHERE user_id = ?`,
    [token, sessionId, user.id]
  );
} else {
  // INSERT FIRST TIME
  await pool.query(
    `INSERT INTO user_sessions (user_id, token, session_id, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
    [user.id, token, sessionId]
  );


  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const sessionId = uuidv4();

  await pool.query(
    `INSERT INTO user_sessions (user_id, token, session_id, expires_at)
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
    [user.id, token, sessionId]
  );

  delete user.password;

  return { token, user };
}
};