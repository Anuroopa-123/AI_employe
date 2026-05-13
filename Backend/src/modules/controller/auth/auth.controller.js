import pool from "../../../config/db.js";
import { registerUser, loginUser } from "../../service/auth/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await registerUser(name, email, password);

    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const checkRegistration = async (req, res) => {
  try {
    const [orgs] = await pool.query(
      "SELECT COUNT(*) as count FROM organizations"
    );

    res.json({
      allowRegister: orgs[0].count === 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const data =
      await loginUser(email, password,req);

    res.json({
      success: true,
      ...data
    });

  } catch (err) {

    // SECURITY SESSION
    if (
      err.message ===
      "SECURITY_ACTIVE_SESSION"
    ) {

      return res.status(403).json({

        success: false,

        security: true,

        message:
          "You are already logged in on another device or browser. Please logout from there first."

      });

    }

    res.status(401).json({

      success: false,

      message: err.message

    });

  }

};


export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({ success: true });
    }

    const token = authHeader.split(" ")[1];

    await pool.query(
     ` UPDATE user_sessions SET is_active = FALSE WHERE token = ? `,
      [token]
    );

    res.json({ success: true, message: "Logged out" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};