const task = require("../model/task.model");
const pagination = require("../helper/pagination.helper");

//# GET [/tasks]
module.exports.homeTask = async (req, res) => {
  const status = req.query.status;
  const condition = {
    deleted: false,
  };

  let tasks;
  // filter status
  if (status) {
    condition.status = status;
  }
  //end filter status

  // sort
  let sort = {};
  if (req.query.sortkey && req.query.sortvalue) {
    sort[req.query.sortkey] = req.query.sortvalue;
  }
  //end sort

  // pagination
  //# count length document
  const countDocument = await task.countDocuments({ deleted: false });

  const paginationObj = pagination(
    {
      currentPage: 1,
    },
    req.query,
    countDocument
  );

  //end pagination

  tasks = await task
    .find(condition)
    .sort(sort)
    .limit(paginationObj.limit)
    .skip((paginationObj.currentPage - 1) * paginationObj.limit);

  res.json(tasks);
};

//# GET [/tasks/detail/:id]
module.exports.detailTask = async (req, res) => {
  try {
    console.log("run here");
    const id = req.params.id;

    const tasks = await task.findOne({
      _id: id,
      deleted: false,
    });

    res.json(tasks);
  } catch (error) {
    res.json({ status: 404 });
  }
};

//# [PATCH] /api/v1/tasks/change/status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const status = req.body.status;

    await task.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "update success fully",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Does not exist",
    });
  }
};

//# [PATCH] /api/v1/tasks/change/status/multip
module.exports.changeStatusMul = async (req, res) => {
  try {
    const { id, key, value } = req.body;

    if (key === "status") {
      // update status

      await task.updateMany(
        {
          _id: { $in: id },
        },
        {
          status: value,
        }
      );

      res.json({
        code: 200,
        message: "update success",
      });

      //end update status
    } else if (key === "delete") {
      // delete multip

      await task.updateMany(
        {
          _id: { $in: id },
        },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );

      res.json({
        code: 200,
        message: "delete success",
      });

      //end delete multip
    }
  } catch (error) {
    res.json({ code: 400 });
  }
};

//# [POST] /api/v1/tasks/create
module.exports.createTask = async (req, res) => {
  try {
    const newTask = new task(req.body);
    await newTask.save();
    res.json({
      code: 200,
      message: "create success",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "create failed",
    });
  }
};

//# [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await task.updateOne(
      {
        _id: id,
      },
      req.body
    );
    res.json({
      code: 200,
      message: "update success",
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};

//# [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await task.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );

    res.json({
      code: 200,
      message: "delete success",
    });
  } catch (error) {
    res.json({
      code: 400,
    });
  }
};
