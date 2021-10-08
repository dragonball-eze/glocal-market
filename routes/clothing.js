const router = require("express").Router();
const Clothing = require("../models/Clothing.model");
const fileUpload = require("../config/cloudinary");
const User = require("../models/User.model");

//http://localhost:5000/clothes
router.get("/clothes", async (req, res) => {
  try {
    const clothes = await Clothing.find().populate("user");
    res.status(200).json(clothes);
  } catch (e) {
    res.status(500).json({ message: e.message }); // yes on Postman
  }
});

router.post("/clothes", async (req, res) => {
  const { brand, size, type, usage, user, imageUrl } = req.body;
  if (!brand || !size || !type) {
    res.status(400).json({ message: "Missing fields" });
    return;
  }

  try {
    const response = await Clothing.create({
      brand,
      size,
      type,
      usage,
      user,
      imageUrl,
    });
    res.status(200).json(response); // 200 => success

    await User.findByIdAndUpdate(user._id, {
      $push: { wardrobe: response },
    });

  } catch (e) {
    res.status(500).json({ message: e.message }); //yes on Postman
  }
});

//http://localhost:5000/clothes/123412432
router.get("/clothes/:id", async (req, res) => {
  try {
    const response = await Clothing.findById(req.params.id).populate("user");
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message }); // yes on p
  }
});

router.put("/clothes/:id", async (req, res) => {
  const { brand, size, user, type, usage, imageUrl } = req.body;

  if (!brand || !size || !type) {
    res.status(400).json({ message: "Missing fields" }); //yop
    return;
  }
  try {
    const response = await Clothing.findByIdAndUpdate(
      req.params.id,
      {
        brand,
        size,
        type,
        usage,
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
router.delete("/clothes/:id", async (req, res) => {
  try {
    await Clothing.findByIdAndRemove(req.params.id);
    res
      .status(200)
      .json({ message: `Garment with id ${req.params.id} was deleted.` }); // y o p
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
