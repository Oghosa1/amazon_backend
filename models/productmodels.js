const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      require: true,
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating",
  }],
});

// #1
const Productmodels = mongoose.model("Product", productSchema);
module.exports = { Productmodels, productSchema };

// // #2
// module.exports = mongoose.model('Product', productSchema);
