import bcrypt from "bcrypt";

import {
  connectDB,
  getPool
} from "../config/db.js";

async function seed() {

  // CONNECT DB
  await connectDB();

  // GET POOL
  const pool = getPool();

  // HASH PASSWORD
  const hashedPassword =
    await bcrypt.hash(
      "admin123",
      10
    );

  // INSERT ROLES
  await pool.query(`

    INSERT IGNORE INTO roles
    (name, description)

    VALUES
    ('Admin', 'Full access'),
    ('Manager', 'Manages employees'),
    ('Employee', 'Basic access')

  `);

  // INSERT ADMIN USER
  await pool.query(`

    INSERT INTO users
    (name, email, password)

    VALUES
    (?, ?, ?)

  `, [

    "Admin",
    "admin@test.com",
    hashedPassword

  ]);

  console.log(
    "Seeder completed successfully"
  );

  process.exit();

}

seed();