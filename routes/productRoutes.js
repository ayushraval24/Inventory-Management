const router = require("express").Router();
const Product = require("../models/index").products;
const User = require("../models/index").users;
const ProductController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
let passport = require("passport");

const destination = path.join(__dirname, "..", "public", "uploads", "products");

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

router.get("/search", authRequired, ProductController.searchProducts);
router.get("/inventory", ProductController.getInventory);
router.get("/:id", authRequired, ProductController.getSingleProduct);
router.get("/", authRequired, ProductController.getAllProducts);
router.post(
  "/",
  authRequired,
  upload.single("image"),
  ProductController.createProduct
);
router.put(
  "/:id",
  authRequired,
  upload.single("image"),
  ProductController.updateProduct
);
router.delete("/:id", authRequired, ProductController.deleteProduct);

module.exports = router;
