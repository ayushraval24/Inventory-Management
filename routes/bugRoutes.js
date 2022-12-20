const router = require("express").Router();
const BugController = require("../controllers/bugController");
const validator = require("../helper/validators");
const Auth = require("../helper/authValidator");

router.get("/", Auth.authRequired, BugController.getAllBugs);

router.post(
  "/",
  Auth.authRequired,
  validator.bugValidator,
  BugController.createBug
);

module.exports = router;
