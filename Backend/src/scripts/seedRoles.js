import pool from "../config/db.js";

await pool.query(`
  INSERT IGNORE INTO roles (name, description) VALUES
  ('Admin', 'Full access'),
  ('Manager', 'Manages employees'),
  ('Employee', 'Basic user')
`);