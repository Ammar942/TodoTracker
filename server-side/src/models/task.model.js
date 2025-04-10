const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    taskName: { type: String, required: true },
    priority: { type: String, required: true, enum: ["Low", "Medium", "High"] },
    endDate: { type: Date, required: true },
    reminder: {
      type: String,
    },
    timeSpent: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
