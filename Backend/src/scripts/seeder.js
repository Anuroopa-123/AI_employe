import pool from "../config/db.js";
import bcrypt from "bcrypt";

const seed = async () => {
  const password = await bcrypt.hash("admin123", 10);

  await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    ["Admin", "admin@test.com", password]
  );

  console.log("Seeder run successfully");
  process.exit();
};

seed();