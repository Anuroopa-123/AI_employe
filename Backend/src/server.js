import app from "./app.js";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await pool.query("SELECT 1"); // test DB
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed ❌", err.message);
    process.exit(1);
  }
})();