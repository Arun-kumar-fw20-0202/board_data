const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Todo", "Doing", "Done"],
      default: "Todo",
    },
    subtasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subtask",
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
