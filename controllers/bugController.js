const Bug = require("../models/index").bugs;
const { validationResult } = require("express-validator");

exports.getAllBugs = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const finalError = {
      status: 422,
      message: errors.errors[0].msg,
    };
    return next(finalError);
  }
  try {
    const bugs = await Bug.findAll();
    return res.status(200).json({
      message: "Bugs fetched successfully",
      data: bugs,
    });
  } catch (err) {
    next(err);
  }
};

exports.createBug = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const finalError = {
      status: 422,
      message: errors.errors[0].msg,
    };
    console.log("Finl err:", finalError);
    return next(finalError);
  }
  try {
    const { subject, message } = req.body;

    const bug = Bug.create({
      subject: subject,
      message: message,
    });

    return res.status(201).json({
      message: "Bug submitted successfully",
      data: bug,
    });
  } catch (err) {
    next(err);
  }
};
