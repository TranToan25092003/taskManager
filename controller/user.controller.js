const user = require("../model/user.model");
const forgotModel = require("../model/forgotPassword.model");

const sendMail = require("../helper/sendmail.helper");
const md5 = require("md5");
const random = require("../helper/randomToken");

//# [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);

    // check duplicate email

    const account = await user.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (account) {
      res.json({
        code: 400,
        message: "email already exist",
      });
      return;
    }

    //end check duplicate email

    // create account

    const newAccount = new user({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
    });

    await newAccount.save();

    res.cookie("token", newAccount.token);

    res.json({
      code: 200,
      message: "success",
      token: newAccount.token,
    });

    //end create account
  } catch (error) {
    res.json({
      code: 400,
      message: "can not singup",
    });
  }
};

//# [POST] /api/v1/user/login
module.exports.login = async (req, res) => {
  try {
    // find account in db

    const account = await user.findOne({
      email: req.body.email,
      deleted: false,
    });

    //end find account in db

    // check exist account
    if (!account) {
      res.json({
        code: 400,
        message: "account does not exist",
      });
      return;
    }
    //end check exist account

    // check password
    if (md5(req.body.password) !== account.password) {
      res.json({
        code: 400,
        message: "password incorrect",
      });
      return;
    }
    //end check password

    const token = account.token;
    res.cookie("token", token); // set token

    res.json({
      code: 200,
      message: "login success",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Can not login",
    });
  }
};

//# [POST] /api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    // find email in db
    const existEmail = await user.findOne({
      email: email,
      deleted: false,
    });
    // end find email in db

    // check email exist
    if (!existEmail) {
      res.json({
        code: 400,
        message: "email does not exist",
      });
      returns;
    }
    //end check email exist

    // create object forgot password
    const OTP = random.OTP(6);
    const objectForgotPassword = new forgotModel({
      email: email,
      OTP: OTP,
      expireAt: Date.now(),
    });

    await objectForgotPassword.save();

    // end create object forgot password

    // send otp
    const subject = "Your OTP";
    const content = `Your OTP is: <b>${OTP}</b> it will be expired in 3 minutes`;
    sendMail.send(email, subject, content);
    //end send otp

    res.json({
      code: 200,
      message: "send otp success",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};

//# [POST] /api/v1/user/password/otp
module.exports.otp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;

    console.log(email);
    console.log(otp);
    // check email
    const accountForgot = await forgotModel.findOne({
      email: email,
      OTP: otp,
    });

    if (!accountForgot) {
      res.json({
        code: 400,
        message: "OTP is not correct",
      });
      return;
    }
    //end check email

    // get user when otp is correct
    const account = await user.findOne({
      email: email,
    });

    const token = account.token;
    res.cookie("token", token);
    //end  get user when otp is correct

    res.json({
      code: 200,
      message: "success",
      token: token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};

//# [POST] /api/v1/user/password/reset
module.exports.reset = async (req, res) => {
  try {
    const token = req.body.token;
    const password = req.body.password;

    // check exist account
    const account = await user.findOne({
      token: token,
    });

    if (!account) {
      res.json({
        code: 400,
        message: "account does not exist",
      });
      return;
    }

    //end check exist account

    // check old pass
    if (md5(password) === account.password) {
      res.json({
        code: 400,
        message: "duplicate to old password",
      });
      return;
    }
    //end check old pass

    // change password
    await user.updateOne(
      {
        token: token,
      },
      {
        password: md5(password),
      }
    );
    //end change password

    res.json({
      code: 200,
      message: "success",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};

//# [GET] /api/v1/user/detail
module.exports.information = async (req, res) => {
  try {
    const token = req.cookies.token;

    //find account
    const account = await user
      .findOne({
        token: token,
        deleted: false,
      })
      .select("fullname email");
    //end find account

    // check exist
    if (!account) {
      res.json({
        code: 400,
        message: "account does not exist",
      });
      return;
    }
    //end check exist

    res.json({
      code: 200,
      message: "success",
      infor: account,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "error",
    });
  }
};
