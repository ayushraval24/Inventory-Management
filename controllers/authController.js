const User = require("../models/UserModel");
const { validationResult } = require("express-validator");
const transporter = require("../config/email");
const jwt = require("jsonwebtoken");

exports.verifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      const err = new Error();
      err.status = 404;
      err.message = "Missing Token";
      return next(err);
    }

    const payload = jwt.verify(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );

    if (!payload) {
      const err = new Error();
      err.status = 401;
      err.message = "Invalid Token";
      return next(err);
    }

    const user = await User.findById(payload.id);

    if (user.verificationToken !== token) {
      const err = new Error();
      err.status = 401;
      err.message = "Invalid Token";
      return next(err);
    }

    const finalUser = await User.findByIdAndUpdate(
      payload.id,
      {
        verified: true,
        verificationToken: null,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "User registered successfully",
      data: finalUser.toAuthJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const finalError = {
      status: 422,
      message: errors.errors[0].msg,
    };
    return next(finalError);
  }

  try {
    const { email, phone, password, confirmPassword } = req.body;

    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      const err = new Error();
      err.status = 422;
      err.message = "Email is already in use";
      return next(err);
    }

    const user = await User.create({ email, password, phone });

    user.setPassword(password);

    const verificationToken = user.generateVerificationToken();

    // const url = `http://localhost:8000/api/auth/verify/${verificationToken}`;
    const url = `${process.env.BASE_URL}/verify-user/${verificationToken}`;

    transporter.sendMail(
      {
        to: user.email,
        subject: "Very Account",
        html: `Click <a href="${url}">here </a> to verify your account`,
      },
      (err, info) => {
        if (err) {
          next(err);
        }
      }
    );

    return user.save().then(() => {
      return res.status(200).json({
        message: `Sent a verification email to ${user.email}`,
        success: true,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const finalError = {
        status: 422,
        msg: errors.errors[0].msg,
      };
      return next(finalError);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const err = new Error();
      err.status = 404;
      err.message = "Invalid credentials";
      next(err);
    }

    const validatePassword = user.validatePassword(password);

    if (validatePassword === false) {
      const err = new Error();
      err.status = 403;
      err.message = "Invalid credentials";
      return next(err);
    }

    if (validatePassword === true) {
      if (user.verified === false) {
        const err = new Error();
        err.status = 403;
        err.message = "Verify your account first";
        return next(err);
      } else {
        return res.status(200).json({
          message: "User logged in successfully",
          data: user.toAuthJSON(),
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const finalError = {
        status: 422,
        message: errors.errors[0].msg,
      };
      return next(finalError);
    }

    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const err = new Error();
      err.status = 403;
      err.message = "User with given email does not exist";
      return next(err);
    }

    const forgotPasswordToken = user.generateForgotPasswordToken();

    const url = `${process.env.BASE_URL}/changePassword/${forgotPasswordToken}`;

    transporter.sendMail(
      {
        to: user.email,
        subject: "Forgot Password",
        html: `Click <a href="${url}">here </a> to change your password`,
      },
      (err, info) => {
        if (err) {
          next(err);
        } else {
          return user.save().then(() =>
            res.status(200).json({
              message: `Sent an email to ${user.email} to change your password`,
            })
          );
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const finalError = {
        status: 422,
        message: errors.errors[0].msg,
      };
      return next(finalError);
    }

    const { token } = req.params;

    if (!token) {
      const err = new Error();
      err.status = 401;
      err.message = "Missing token";
      next(err);
    }

    const payload = jwt.verify(
      token,
      process.env.USER_FORGOT_PASSWORD_TOKEN_SECRET
    );

    if (!payload) {
      const err = new Error();
      err.status = 401;
      err.message = "Invalid token";
      next(err);
    }

    const { password, confirmPassword } = req.body;

    const user = await User.findById(payload.id);

    if (user.forgotPasswordToken !== token) {
      const err = new Error();
      err.status = 401;
      err.message = "Invalid Token";
    }

    user.setPassword(password);
    await user.save();

    const updatedUser = await User.findByIdAndUpdate(user._id, {
      forgotPasswordToken: null,
    });

    return res.status(200).json({
      message: "Password updated successfully",
      data: updatedUser.toAuthJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    const result = users.map((user) => {
      const newUser = user.toClient();
      const { password, salt, ...details } = newUser;
      return details;
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);

    const {
      password,
      salt,
      verificationToken,
      forgotPasswordToken,
      ...details
    } = user.toClient();

    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      data: details,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const id = req.user.id;

    let finalData = {};

    if (req.file) {
      finalData = {
        ...req.body,
        avatar: req.file.filename,
      };
    } else {
      finalData = req.body;
    }

    const user = await User.findByIdAndUpdate(id, finalData);

    const {
      password,
      salt,
      forgotPasswordToken,
      verificationToken,
      ...details
    } = user.toClient();

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedUser: details,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
