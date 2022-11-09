const router = require("express").Router();
const validator = require("../helper/validators");
const authController = require("../controllers/authController");
let passport = require("passport");
const User = require("../models/index").users;
require("../config/passport");
const multer = require("multer");
const path = require("path");

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

function authRequired(request, response, next) {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      return response.status(401).json({ message: "Unauthorized" });
    } else {
      console.log("Token: ", token);
      try {
        const user = await User.findOne({
          where: { id: token.id },
        });
        request.user = user;
        if (!user) {
          return response
            .status(401)
            .json({ message: "User does not exist anymore" });
        }
      } catch (error) {
        next(error);
      }
      next();
    }
  })(request, response, next);
}

router.get("/verify/:token", authController.verifyAccount);

router.post("/signup", validator.signupValidation, authController.signup);

router.post("/signin", validator.signinValidation, authController.signin);

router.post(
  "/forgot-password",
  validator.forgotPasswordValidation,
  authController.forgotPassword
);

router.post(
  "/change-password/:token",
  validator.changePasswordValidation,
  authController.changePassword
);

router.get("/", authRequired, authController.getAllUsers);

router.get("/profile", authRequired, authController.getProfile);

router.put(
  "/profile",
  authRequired,
  upload.single("avatar"),
  authController.updateProfile
);

module.exports = router;
