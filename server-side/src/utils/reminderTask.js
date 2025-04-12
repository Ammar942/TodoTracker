const nodemailer = require("nodemailer");
const Task = require("../models/task.model");

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

module.exports = (agenda) => {
  agenda.define("send task reminder", async (job) => {
    const { taskId } = job.attrs.data;
    const task = await Task.findById(taskId).populate("user");

    if (!task || task.status === "Completed") return;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: task.user.email,
      subject: "⏰ Task Reminder",
      text: `Don't forget: Your task "${task.taskName}" is due on ${new Date(
        task.endDate
      ).toLocaleString()}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("Error sending email:", err);
      else console.log("Reminder email sent:", info.response);
    });
  });
};
