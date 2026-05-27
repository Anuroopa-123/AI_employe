import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {

    // CONNECT DB + CREATE DATABASE + CREATE TABLES
    await connectDB();

    console.log("DB Connected");

    // START SERVER
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {

    console.error("DB connection failed ❌", err.message);

    process.exit(1);

  }
})();