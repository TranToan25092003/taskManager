const mongoose = require("mongoose");
const randomToken = require("../helper/randomToken");
//# create a schema for category
const userSchema = new mongoose.Schema(
  {
    fullname: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: randomToken.random(20),
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },

  { timestamps: true }
);

//# create model task (name, schema, collection name)
const user = mongoose.model("user", userSchema, "users");

//# export model
module.exports = user;
