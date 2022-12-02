const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");
let passport = require("passport");
const Auth = require("../helper/authValidator");

// router.post("/", Auth.authRequired, CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
