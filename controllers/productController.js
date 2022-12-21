const Product = require("../models/ProductModel");
const { validationResult } = require("express-validator");

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const per_page = Number(req.query.per_page);

    let products;

    const totalProducts = await Product.find().populate("category");

    if (page >= 0 && per_page >= 0) {
      products = await Product.find()
        .limit(per_page)
        .skip(page * per_page)
        .populate("category");
      products = products.map((item) => item.toClient());
    }

    const finalProducts = totalProducts.map((item) => item.toClient());

    return res.status(200).json({
      message: "Products fetched successfully",
      count: totalProducts.length,
      data: page >= 0 && per_page >= 0 ? products : finalProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("category");

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product.toClient(),
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error();
      error.status = 422;
      error.error = errors.errors[0];
      return next(error);
    }

    const imageUrls =
      req.files.length > 0 ? req.files.map((image) => image.filename) : [];

    const productDetails = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price == "" ? 0 : req.body.price,
      quantity: req.body.quantity == "" ? 0 : req.body.quantity,
      description: req.body.description,
      image: imageUrls,
    };

    const product = await Product.create(productDetails);
    return res.status(201).json({
      message: "Product added successfully",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    let finalData = {};
    if (req.files) {
      finalData = {
        ...req.body,
        image: req.files.map((image) => image.filename),
      };
    } else {
      finalData = req.body;
    }

    if (req.body?.quantity == "") {
      finalData.quantity = 0;
    }
    if (req.body?.price == "") {
      finalData.price = 0;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: finalData,
      },
      { new: true }
    ).populate("category");
    return res.status(200).json({
      message: "Product updated successfully",
      success: product.toClient(),
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      const err = new Error();
      err.status = 422;
      err.message = "Product id is required";
      next(err);
    }

    const product = await Product.findByIdAndRemove(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.getInventory = async (req, res, next) => {
  try {
    let outOfStock = 0;
    let totalValue = 0;
    let productsCount = 0;
    const products = await Product.find();
    productsCount = products.length;

    products.forEach((item) => {
      totalValue = totalValue + item.price * item.quantity;
      if (item?.quantity === 0) {
        outOfStock = outOfStock + 1;
      }
    });

    return res.status(200).json({
      message: "Inventory details detched successfully",
      data: {
        outOfStock: outOfStock,
        value: totalValue,
        count: productsCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const search = req.query.search;
    const page = Number(req.query.page);
    const per_page = Number(req.query.per_page);

    const totalCount = await Product.find({
      name: { $regex: search, $options: "i" },
    });

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    })
      .limit(per_page)
      .skip(page * per_page)
      .populate("category");

    const finalProducts = products.map((item) => item.toClient());
    return res.status(200).json({
      message: "Products fetched successfully",
      data: finalProducts,
      count: totalCount.length,
    });
  } catch (err) {
    next(err);
  }
};
