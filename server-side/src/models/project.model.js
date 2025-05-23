const mongoose = require("mongoose");
const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    deadline: { type: Date },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
