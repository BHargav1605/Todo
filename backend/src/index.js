import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();  // Load .env ONLY ONCE

import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";
import "./scheduler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const MONGO = process.env.MONGO_URI;

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("✅ Mongo connected");
    app.listen(8000, () => console.log("🚀 Server running on port 8000"));
  })
  .catch((err) => console.error("❌ DB connect failed:", err));
