const mongoose = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const bookSchema = new mongoose.Schema(
  {
    author: String,
    /*  type: mongoose.Schema.Types.ObjectId,
    ref: "Author", */
    title: String,
    genre: String,
    language: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    review: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
