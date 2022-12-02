const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      allowNull: false,
    },
    bio: {
      type: String,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    salt: {
      type: String,
    },
    avatar: {
      type: String,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.password === hash;
};

userSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET_KEY
  );
};

userSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

userSchema.methods.toClient = function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

userSchema.methods.generateVerificationToken = function () {
  const verificationToken = jwt.sign(
    { id: this._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "2d" }
  );
  this.verificationToken = verificationToken;
  return verificationToken;
};

userSchema.methods.generateForgotPasswordToken = function () {
  const forgotPasswordToken = jwt.sign(
    { id: this._id },
    process.env.USER_FORGOT_PASSWORD_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  this.forgotPasswordToken = forgotPasswordToken;
  return forgotPasswordToken;
};

module.exports = mongoose.model("Users", userSchema);
