import {

  connectDB,
  getPool

} from "../config/db.js";

async function seedRoles() {

  try {

    // CONNECT DB
    await connectDB();

    // GET POOL
    const pool = getPool();

    // INSERT ROLES
    await pool.query(`

      INSERT IGNORE INTO roles
      (name, description)

      VALUES

      (
        'Admin',
        'Full access'
      ),

      (
        'Manager',
        'Manages employees'
      ),

      (
        'Employee',
        'Basic user'
      )

    `);

    console.log(
      "Roles Seeded Successfully"
    );

    process.exit();

  } catch (err) {

    console.log(
      "Seeder Error:",
      err.message
    );

    process.exit(1);

  }

}

seedRoles();