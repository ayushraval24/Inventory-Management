const router = require("express").Router();
const ProductController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");
const Auth = require("../helper/authValidator");

const destination = path.join(__dirname, "..", "uploads", "products");

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
      cb("Only supported png,jpg,jpeg and svg files");
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    return checkFileType(file, cb);
  },
});

router.get("/search", Auth.authRequired, ProductController.searchProducts);
router.get("/inventory", Auth.authRequired, ProductController.getInventory);
router.get("/:id", Auth.authRequired, ProductController.getSingleProduct);
router.get("/", Auth.authRequired, ProductController.getAllProducts);
router.post(
  "/",
  Auth.authRequired,
  upload.array("image"),
  ProductController.createProduct
);
router.put(
  "/:id",
  Auth.authRequired,
  upload.array("image"),
  ProductController.updateProduct
);
// router.post(
//   "/",
//   Auth.authRequired,
//   upload.single("image"),
//   ProductController.createProduct
// );
// router.put(
//   "/:id",
//   Auth.authRequired,
//   upload.single("image"),
//   ProductController.updateProduct
// );
router.delete("/:id", Auth.authRequired, ProductController.deleteProduct);

module.exports = router;
