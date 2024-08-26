const express = require("express");
// const controller = require("");
const router = new express.Router();
const controller = require("../../../controller/tasks.contoller");

// model
const task = require("../../../model/task.model");
// end model

//# GET [/tasks]
router.get("/", controller.homeTask);

//# GET [/tasks/detail/:id]
router.get("/detail/:id", controller.detailTask);

//# /api/v1/tasks/change/status/:id
router.patch("/change/status/:id", controller.changeStatus);

//# [PATCH] /api/v1/tasks/change/status-multip
router.patch("/change/status-multip", controller.changeStatusMul);

//# [POST]
router.post("/create", controller.createTask);

//# [PATCH] /api/v1/tasks/edit/:id
router.patch("/edit/:id", controller.edit);

//# [DELETE] /api/v1/tasks/delete/:id
router.delete("/delete/:id", controller.delete);

module.exports = router;
