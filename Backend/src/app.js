import express from "express";
import cors from "cors";
import testRoutes from "./modules/routes/test.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

export default app;