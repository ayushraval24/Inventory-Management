const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

bugSchema.methods.toClient = function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

module.exports = mongoose.model("Bugs", bugSchema);
