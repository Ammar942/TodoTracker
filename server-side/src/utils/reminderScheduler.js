const cron = require("node-cron");
const Task = require("../models/task.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const reminderToMs = {
  "24h": 24 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1h": 1 * 60 * 60 * 1000,
};
cron.schedule("*/10 * * * *", async () => {
  console.log("Running reminder scheduler every 10 minutes");

  const now = new Date();

  const tasks = await Task.find({
    reminder: { $ne: null },
    status: { $ne: "Completed" },
  }).populate("user");
  console.log(tasks);
  tasks.forEach((task) => {
    const reminderTime = new Date(task.endDate - reminderToMs[task.reminder]);

    const diff = Math.abs(reminderTime - now);
    if (diff <= 5 * 60 * 1000) {
      sendReminderEmail(task.user.email, task.taskName, task.endDate);
      console.log(
        "Sending reminder email for task:",
        task.user.email,
        task.name
      );
    }
  });
});
function sendReminderEmail(email, taskName, endDate) {
  console.log("Sending email to:", email);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "⏰ Task Reminder",
    text: `Don't forget: Your task "${taskName}" is due on ${new Date(
      endDate
    ).toLocaleString()}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Error sending email:", err);
    else console.log("Reminder email sent:", info.response);
  });
}
