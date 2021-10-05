const router = require("express").Router();
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");

//GET USER Profile
router.get("/profile/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate("library")
        .populate("wardrobe");
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: e.message }); 
    }
  });

  //http://localhost:3000/profile/:id/edit
router.get("/profile/:id/edit", async (req,res) => {
  const user = await User.findById(req.params.id);
  // req.session.currentUser._id
  res.render("profile/user-edit", user);
})

router.post("/profile/:id/edit", fileUpload.single("image"), async (req,res) => {
  let fileUrlOnCloudinary = "";
  if(req.file) {
      fileUrlOnCloudinary = req.file.path; //the path on cloudinary
  } 

  const { email, description, contact, phone, imageUrl} = req.body;
  await User.findByIdAndUpdate(req.params.id, {
      description,
      contact,
      email,
      phone,
      imageUrl: fileUrlOnCloudinary,
  });
  res.redirect(`/profile/${req.params.id}`);
});


router.put("/profile/:id", fileUpload.single("image"), async (req, res) => {

  let fileUrlOnCloudinary = "";
  if(req.file) {
      fileUrlOnCloudinary = req.file.path; //the path on cloudinary
  } 
  const { description, contact, email, phone, imageUrl } = req.body;

  if (!contact || !email || !phone) {
    res.status(400).json({ message: "Missing fields" }); 
    return;
  }
  try {
    const response = await User.findByIdAndUpdate(
      req.params.id,
      {
        description,
        contact,
        email,
        phone,
        imageUrl,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/profile/:id/image", fileUpload.single("image"), async (req, res) => {

  let fileUrlOnCloudinary = "";
  if(req.file) {
      fileUrlOnCloudinary = req.file.path; //the path on cloudinary
  } 
  const { imageUrl } = req.body;

  if (!imageUrl) {
    res.status(400).json({ message: "Missing fields" }); 
    return;
  }
  try {
    const response = await User.findByIdAndUpdate(
      req.params.id,
      {
        imageUrl,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//http://localhost:3000/profile/:id/image
router.get("/profile/:id/image", async (req,res) => {
  const user = await User.findById(req.params.id);
  // req.session.currentUser._id
  res.render("profile/user-image", user);
})

router.post("/profile/:id/image", fileUpload.single("image"), async (req,res) => {
  let fileUrlOnCloudinary = "";
  if(req.file) {
      fileUrlOnCloudinary = req.file.path; //the path on cloudinary
  } 

  const {username, description, contact, email, phone} = req.body;
  await User.findByIdAndUpdate(req.params.id, {
      username,
      description,
      contact,
      email,
      phone,
      imageUrl: fileUrlOnCloudinary,
  });
  res.redirect(`/profile/${req.params.id}`);
});

module.exports = router;