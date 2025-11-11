import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: String,
  done: { type: Boolean, default: false },
  dueAt: { type: Date }, // 🕒 new field
});

export default mongoose.model("Todo", todoSchema);
