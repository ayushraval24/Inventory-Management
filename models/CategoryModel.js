const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.methods.toClient = function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

module.exports = mongoose.model("Categories", categorySchema);
