"use strict";

const taskRouter = require("./task.router");
const userRouter = require("./user.router");

module.exports = (app) => {
  const version = "/api/v1";

  app.use(version + "/tasks", taskRouter);

  app.use(version + "/user", userRouter);
};
