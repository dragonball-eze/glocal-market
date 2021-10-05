const router = require("express").Router();
const Book = require("../models/Book.model");
const fileUpload = require("../config/cloudinary");
const User = require("../models/User.model");

//http://localhost:5000/books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/books", async (req, res) => {
  const { author, title, genre, review, language, imageUrl, user } = req.body;
  if (!author || !title) {
    res.status(400).message({ message: "Missing fields" }); 
  }

  try {
    const response = await Book.create({
      author,
      title,
      genre,
      review,
      language,
      user,
      imageUrl,
    });
    console.log(response);
    res.status(200).json(response); // 200 => success
    console.log("user : ", user._id);


    await User.findByIdAndUpdate(user._id, {
      $push: { library: response },
    });

    
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//http://localhost:5000/books/123412432
router.get("/books/:id", async (req, res) => {
  try {
    const response = await Book.findById(req.params.id).populate("user");
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message }); 
  }
});

//http://localhost:5000/books/123412432/edit?
router.put("/books/:id", async (req, res) => {
  const { author, title, genre, language, review, user, imageUrl } = req.body;

  if (!author || !title) {
    res.status(400).json({ message: "Missing fields" }); 
    return;
  }
  try {
    const response = await Book.findByIdAndUpdate(
      req.params.id,
      {
        author,
        title,
        genre,
        language,
        review,
        user,
        imageUrl,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//DELETE
router.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndRemove(req.params.id);
    res
      .status(200)
      .json({ message: `Book with id ${req.params.id} was deleted.` });
  } catch (e) {
    res.status(500).json({ message: e.message }); 
  }
});

router.post("/upload", fileUpload.single("file"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({ message: e.message }); 
  }
});

module.exports = router;