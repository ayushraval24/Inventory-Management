const router = require("express").Router();
const validator = require("../helper/validators");
const authController = require("../controllers/authController");
let passport = require("passport");
const User = require("../models/UserModel");
require("../config/passport");
const multer = require("multer");
const path = require("path");
const Auth = require("../helper/authValidator");

const destination = path.join(__dirname, "..", "public", "uploads", "profile");

const storage = multer.diskStorage({
  destination: destination,
  filename: (req, file, cb) => {
    fileName = `${Date.now()}-${file.originalname}`;
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const checkFileType = function (file, cb) {
  if (file) {
    const types = /png|jpg|jpeg|svg|JPG|JPEG|SVG|PNG/;

    const extName = types.test(path.extname(file.originalname));

    if (extName) {
      cb(null, true);
    } else {
      cb(next("Only supported png,jpg,jpeg and svg files"));
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    return checkFileType(file, cb);
  },
});

router.get("/verify/:token", authController.verifyAccount);

router.post("/signup", validator.signupValidation, authController.signup);

router.post("/signin", validator.signinValidation, authController.signin);

router.post(
  "/forgotPassword",
  validator.forgotPasswordValidation,
  authController.forgotPassword
);

router.post(
  "/changePassword/:token",
  validator.changePasswordValidation,
  authController.changePassword
);

router.get("/", Auth.authRequired, authController.getAllUsers);

router.get("/profile", Auth.authRequired, authController.getProfile);

router.put(
  "/profile",
  Auth.authRequired,
  upload.single("avatar"),
  authController.updateProfile
);

module.exports = router;
