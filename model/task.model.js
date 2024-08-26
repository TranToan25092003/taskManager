const mongoose = require("mongoose");

//# create a schema for category
const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },

  { timestamps: true }
);

//# create model task (name, schema, collection name)
const task = mongoose.model("tasks", taskSchema, "tasks");

//# export model
module.exports = task;
