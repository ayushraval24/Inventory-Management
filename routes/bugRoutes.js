const router = require("express").Router();
const BugController = require("../controllers/bugController");
const validator = require("../helper/validators");

router.get("/", BugController.getAllBugs);

router.post("/", validator.bugValidator, BugController.createBug);

module.exports = router;
