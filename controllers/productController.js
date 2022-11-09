const Product = require("../models/index").products;
const { validationResult } = require("express-validator");
const formidable = require("formidable");
const path = require("path");
const { Op } = require("sequelize");

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = req.query.page;
    const per_page = req.query.per_page;

    let products;

    const totalProducts = await Product.findAll({ include: "categoryData" });

    if (page && per_page) {
      products = await Product.findAll({
        // order: [...],
        include: "categoryData",
        limit: Number(per_page),
        offset: Number(page * per_page),
      });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      count: totalProducts.length,
      data: page && per_page ? products : totalProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id, { include: "categoryData" });
    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
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

    console.log(req.body.category);
    const imageUrl = req.file.filename || "";
    const productDetails = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      image: imageUrl,
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
    if (req.file) {
      finalData = {
        ...req.body,
        image: req.file.filename,
      };
    } else {
      finalData = req.body;
    }

    const product = await Product.update(finalData, { where: { id: id } });
    return res.status(200).json({
      message: "Product updated successfully",
      success: product[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(422).json({
        message: "Product id is required",
      });
    }

    const product = await Product.destroy({ where: { id: id } });

    return res.status(200).json({
      message: "Product deleted successfully",
      success: product,
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
    const products = await Product.findAll();
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
    console.log(err);
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const search = req.query.search;

    const products = await Product.findAll({
      include: "categoryData",
      where: {
        name: { [Op.like]: "%" + search + "%" },
      },
    });

    console.log("ProductS:", products);

    if (products.length == 0) {
      return res.status(200).json({
        message: "There are no products",
        data: products,
      });
    } else {
      return res.status(200).json({
        message: "Products fetched successfully",
        data: products,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
