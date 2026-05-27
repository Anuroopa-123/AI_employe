import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let pool;

async function connectDB() {

  // CREATE CONNECTION
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
  });

  // CREATE DATABASE
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );

  await connection.end();

  // CREATE POOL
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
  });

  // READ SQL FILE
const sqlPath = path.join(process.cwd(), "src", "config", "db.sql");

  const sqlFile = fs.readFileSync(sqlPath, "utf8");

  // EXECUTE SQL
  await pool.query(sqlFile);

  console.log("Database & Tables Ready");

  return pool;
}

export { connectDB };

export default pool;