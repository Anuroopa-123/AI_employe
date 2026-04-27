import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import testRoutes from "./modules/routes/test.routes.js";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/routes/auth/auth.routes.js";

const app = express();

/* ===========================
   SECURITY (helmet)
=========================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* ===========================
   CORS
=========================== */
app.use(
  cors({
    origin: "http://localhost:4200", // Angular
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max requests per IP
  message: "Too many requests, try again later",
});

app.use(limiter);

/* ===========================
   BODY PARSER
=========================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
   COOKIE PARSER
=========================== */
app.use(cookieParser());

/* ===========================
   ROUTES
=========================== */
app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);

/* ===========================
   HEALTH CHECK
=========================== */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app;