const { body } = require("express-validator/check");

exports.signupValidation = [
  body("email").not().isEmpty().withMessage("Email id is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("phone").not().isEmpty().withMessage("Phone number is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("confirmPassword is required"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("At least 5 characters are required in Password"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords are not matching");
    }
    return true;
  }),
];

exports.signinValidation = [
  body("email").not().isEmpty().withMessage("Email id is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

exports.forgotPasswordValidation = [
  body("email").not().isEmpty().withMessage("Email id is required"),
  body("email").isEmail().withMessage("Enter a valid email address"),
];

exports.changePasswordValidation = [
  body("password").not().isEmpty().withMessage("Password is required"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm Password is required"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords are not matching");
    }
    return true;
  }),
];

exports.productValidation = [
  body("name").not().isEmpty().withMessage("Product name is required"),
  body("category").not().isEmpty().withMessage("Product category is required"),
  body("price").not().isEmpty().withMessage("Product price is required"),
  body("quantity").not().isEmpty().withMessage("Product quantity is required"),
];

exports.bugValidator = [
  body("subject").not().isEmpty().withMessage("Subject is required"),
  body("message").not().isEmpty().withMessage("Message is required"),
];
