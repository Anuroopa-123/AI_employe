import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../../repository/auth/auth.repository.js";

export const registerUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return await createUser(name, email, hashed);
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  delete user.password;

return { token, user };
};