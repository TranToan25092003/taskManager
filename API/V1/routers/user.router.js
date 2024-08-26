const express = require("express");
// const controller = require("");
const router = new express.Router();
const controller = require("../../../controller/user.controller");

//# [POST] /api/v1/user/register
router.post("/register", controller.register);

//# [POST] /api/v1/user/login
router.post("/login", controller.login);

//# [POST] /api/v1/user/password/forgot
router.post("/password/forgot", controller.forgotPassword);

//# [POST] /api/v1/user/password/otp
router.post("/password/otp", controller.otp);

//# [POST] /api/v1/user/password/reset
router.post("/password/reset", controller.reset);

//# [GET] /api/v1/user/detail
router.get("/detail", controller.information);

module.exports = router;
