const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Categories",
    },
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    image: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.toClient = function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;

  if (obj.category) {
    obj.category.id = obj.category._id;
    delete obj.category._id;
  }

  return obj;
};

module.exports = mongoose.model("Products", productSchema);
