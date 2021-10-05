const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  description: String,
  contact: {
    type: String,
    enum: ["Email", "Phone Call", "Text", "WhatsApp", "Video Call"],
  },
  email: String,
  phone: Number,
  imageUrl: {
    type: String,
    default:"https://picsum.photos/200",
  },
  library: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book"
    }
  ],
  wardrobe: [
    {
      type: Schema.Types.ObjectId,
      ref: "Clothing"
    }
  ]
});

const User = model("User", userSchema);

module.exports = User;
