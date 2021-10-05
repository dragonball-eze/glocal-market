const mongoose = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const clothingSchema = new mongoose.Schema({
  brand: String,
  /* type: mongoose.Schema.Types.ObjectId,
      ref: "Brand", */
  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL"],
  },
  type: 
    {
      type: String,
      enum: ["Shoes", "Shirt", "Pants", "Coat", "Hat", "Sweatshirt"],
    },
  usage: 
    {
      type: String,
      enum: ["Brand New", "Moderately Used", "Vintage"],
    },
  user: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  imageUrl: String,
});

const Clothing = mongoose.model("Clothing", clothingSchema);

module.exports = Clothing;
