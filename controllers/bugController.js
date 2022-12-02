const Bug = require("../models/BugModel");
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
    const bugs = await Bug.find();

    const finalBugs = bugs.map((item) => item.toClient());

    return res.status(200).json({
      message: "Bugs fetched successfully",
      data: finalBugs,
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
