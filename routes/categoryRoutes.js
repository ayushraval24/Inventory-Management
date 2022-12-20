const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");
let passport = require("passport");
const Auth = require("../helper/authValidator");

// router.post("/", Auth.authRequired, CategoryController.createCategory);
router.get("/", Auth.authRequired, CategoryController.getAllCategories);
router.post("/", Auth.authRequired, CategoryController.createCategory);
router.put("/:id", Auth.authRequired, CategoryController.updateCategory);
router.delete("/:id", Auth.authRequired, CategoryController.deleteCategory);

module.exports = router;
