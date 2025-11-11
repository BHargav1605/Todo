import cron from "node-cron";
import nodemailer from "nodemailer";
import Todo from "./models/Todo.js";
import User from "./models/User.js";

import dotenv from "dotenv";
dotenv.config();

// ✅ Gmail SMTP transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 🕒 Scheduler — runs every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    console.log("⏰ Checking for upcoming tasks...");

    const now = new Date();
    const soon = new Date(now.getTime() + 60 * 60 * 1000); // within next 1 hour

    // Find uncompleted tasks due within next 60 minutes
    const todos = await Todo.find({
      done: false,
      dueAt: { $lte: soon, $gte: now },
    }).populate("user");

    if (todos.length === 0) {
      console.log("✅ No upcoming tasks in next 1 hour");
      return;
    }

    // Send reminder email for each matching task
    for (const t of todos) {
      const userEmail = t.user?.email;
      const userName = t.user?.name || "User";
      if (!userEmail) continue;

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: userEmail,
        subject: `⏰ Reminder: ${t.title} is due soon!`,
        text: `Hey ${userName},\n\nYour task "${t.title}" is due at ${new Date(
          t.dueAt
        ).toLocaleString()}.\n\nDon't forget to complete it before the deadline!\n\n- Todo App`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Reminder sent to ${userEmail} for "${t.title}"`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${userEmail}:`, err.message);
      }
    }
  } catch (err) {
    console.error("❌ Scheduler error:", err.message);
  }
});
