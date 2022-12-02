const Category = require("../models/CategoryModel");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const finalCategories = categories.map((item) => item.toClient());

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: finalCategories,
      count: categories.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const name = req.body.name;
    const category = new Category({
      name: name,
    });
    const savedCategory = await category.save();
    return res.status(201).json({
      message: "Category added successfully",
      data: savedCategory.toClient(),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      message: "Category updated successfully",
      data: category.toClient(),
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndRemove(id);
    return res.status(200).json({
      message: "Category deleted successfully",
      data: category.toClient(),
    });
  } catch (err) {
    next(err);
  }
};
