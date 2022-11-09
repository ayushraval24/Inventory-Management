const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.BOOLEAN,
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    forgotPasswordToken: {
      type: DataTypes.STRING,
      default: null,
    },
  });

  User.prototype.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
      .toString("hex");
  };

  User.prototype.validatePassword = function (password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
      .toString("hex");
    return this.password === hash;
  };

  User.prototype.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        id: this.id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      process.env.JWT_SECRET_KEY
    );
  };

  User.prototype.toAuthJSON = function () {
    return {
      id: this.id,
      email: this.email,
      token: this.generateJWT(),
    };
  };

  User.prototype.generateVerificationToken = function () {
    const verificationToken = jwt.sign(
      { id: this.id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      { expiresIn: "2d" }
    );
    this.verificationToken = verificationToken;
    return verificationToken;
  };

  User.prototype.generateForgotPasswordToken = function () {
    const forgotPasswordToken = jwt.sign(
      { id: this.id },
      process.env.USER_FORGOT_PASSWORD_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    this.forgotPasswordToken = forgotPasswordToken;
    return forgotPasswordToken;
  };

  return User;
};
