const router = require("express").Router();
const CategoryController = require("../controllers/categoryController");
const User = require("../models/index").users;
let passport = require("passport");

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

router.get("/", authRequired, CategoryController.getAllCategories);
router.post("/", authRequired, CategoryController.createCategory);
router.put("/:id", authRequired, CategoryController.updateCategory);
router.delete("/:id", authRequired, CategoryController.deleteCategory);

module.exports = router;
