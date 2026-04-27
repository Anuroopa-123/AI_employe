import express from "express";
import pool from "../../config/db.js";

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({
      success: true,
      message: "DB working ✅",
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;