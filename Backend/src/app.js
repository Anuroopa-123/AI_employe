import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import testRoutes from "./modules/routes/test.routes.js";

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

/* ===========================
   HEALTH CHECK
=========================== */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

export default app;