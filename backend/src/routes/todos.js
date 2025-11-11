import express from "express";
import Todo from "../models/Todo.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check auth
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
}

// Get todos
router.get("/", authMiddleware, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
});

// Add todo
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, dueAt } = req.body;
  const todo = await Todo.create({
    user: req.user.id,
    title,
    description,
    dueAt: dueAt ? new Date(dueAt) : null,
  });
  res.json(todo);
});

// Toggle done
router.patch("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { done: req.body.done },
    { new: true }
  );
  res.json(todo);
});

export default router;
