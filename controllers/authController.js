const User = require("../models/index").users;
const { validationResult } = require("express-validator");
const transporter = require("../config/email");
const jwt = require("jsonwebtoken");

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

    const oldUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (oldUser) {
      const err = new Error();
      err.status = 422;
      err.message = "Email is already registered";

      next(err);
    }

    const user = await User.create({ email: email, phone: phone });

    user.setPassword(password);

    const verificationToken = user.generateVerificationToken();

    // const url = `http://localhost:8000/api/auth/verify/${verificationToken}`;
    const url = `${process.env.BASE_URL}/verify-user/${verificationToken}`;

    transporter.sendMail({
      to: user.email,
      subject: "Very Account",
      html: `Click <a href="${url}">here </a> to verify your account`,
    });

    return user.save().then(() =>
      res.status(200).json({
        message: `Sent a verification email to ${email}`,
        success: true,
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(404).json({ errors: { message: `Missing token` } });
    }

    const payload = jwt.verify(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );

    if (!payload) {
      return res.status(401).json({ errors: { message: "Invalid Token" } });
    }

    const user = await User.findByPk(payload.id);

    console.log("Payload: ", payload);
    console.log("User: ", user);
    console.log("TOKEN: ", token);
    console.log("USER: ", user.verificationToken);

    if (user.verificationToken !== token) {
      return res.status(401).json({ errors: { message: "Invalid Token" } });
    }

    const finalUser = await User.update(
      {
        verified: true,
        verificationToken: null,
      },
      { where: { id: user.id } }
    );
    return res.status(200).json({
      message: "User registered successfully",
      data: user.toAuthJSON(),
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
        message: errors.errors[0].msg,
      };
      return next(finalError);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      // return res.status(404).json("User not found")
      return res
        .status(403)
        .json({ errors: { message: "Invalid email or password" } });
    }

    const validatedPassword = user.validatePassword(password);

    if (validatedPassword === false) {
      return res
        .status(403)
        .json({ errors: { message: "Invalid email or password" } });
    }

    if (validatedPassword === true) {
      if (user.verified === false) {
        return res
          .status(403)
          .json({ errors: { message: "Verify your account first" } });
      } else {
        return res.status(200).json({
          message: "User logged in successfully!",
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

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(403)
        .json({ message: "user with given email does not exist" });
    }

    const forgotPasswordToken = user.generateForgotPasswordToken();

    const url = `${process.env.BASE_URL}/change-password/${forgotPasswordToken}`;

    transporter.sendMail(
      {
        to: email,
        subject: "Forgot Password",
        html: `Click <a href="${url}">here </a> to change your password`,
      },
      (err, info) => {
        if (err) {
          next(err);
        } else {
          return user.save().then(() =>
            res.status(200).json({
              message: `Sent a email to ${user.email} to change your password`,
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
      res.status(404).json({ errors: { message: `Missing token` } });
    }

    const payload = jwt.verify(
      token,
      process.env.USER_FORGOT_PASSWORD_TOKEN_SECRET
    );

    if (!payload) {
      res.status(403).json({ errors: { message: `Invalid token` } });
    }

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) {
      res.status(404).json({ errors: { message: `Password must match` } });
    }

    const user = await User.findByPk(payload.id);

    if (user.forgotPasswordToken !== token) {
      return res
        .status(401)
        .json({ errors: { message: "This link has been expired!!" } });
    }

    user.setPassword(password);
    await user.save();
    User.update(
      { forgotPasswordToken: null },
      { where: { email: user.email } }
    ).then((result) => {
      return res.status(200).json({
        message: "Password updated successfully",
        data: user.toAuthJSON(),
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    const result = users.map((user) => {
      const { password, salt, ...details } = user.dataValues;
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

    const user = await User.findByPk(id);

    const {
      password,
      salt,
      verificationToken,
      forgotPasswordToken,
      ...details
    } = user.dataValues;

    return res.status(200).json({
      message: "Current user retrieved",
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

    // const finalData = {
    //   first_name: req.body.first_name,
    //   last_name: req.body.last_name,
    //   phone: req.body.phone,
    //   avatar: imageUrl,
    // };

    const user = await User.update(finalData, { where: { id: id } });

    return res.status(200).json({
      message: "Profile updated successfully",
      success: user[0],
    });
  } catch (err) {
    next(err);
  }
};
