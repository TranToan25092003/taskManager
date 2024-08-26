const mongoose = require("mongoose");

const ForgotPasswordShcema = new mongoose.Schema(
  {
    email: String,
    OTP: String,
    expireAt: {
      type: Date,
      expires: 180,
    },
  },
  { timestamps: true }
);

//# create model product (name, shcema, collection name)
const ForgotPassword = mongoose.model(
  "forgot-password",
  ForgotPasswordShcema,
  "forgot-password"
);

//# export model
module.exports = ForgotPassword;
