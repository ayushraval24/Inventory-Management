const Category = require("../models/index").categories;

exports.getAllCategories = async (req, res, next) => {
  try {
    console.log("Inside");
    const categories = await Category.findAll();
    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      count: categories.length,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const name = req.body.name;
    const category = await Category.create({ name: name });
    return res.status(201).json({
      message: "Category added successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const category = await Category.update(
      { name: name },
      { where: { id: id } }
    );
    return res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.destroy({ where: { id: id } });
    return res.status(200).json({
      message: "Category deleted successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};
