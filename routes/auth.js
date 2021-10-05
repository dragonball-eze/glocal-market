const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");


/* router.get("/", (req, res) => {
  res.render("/index");
})

//Signup Render____________________________________________
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//Login Render_______________________________________________________
router.get("/login", (req, res) => {
  res.render("auth/login");
}); */

//Setting up sign up_______________________________________________________
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.status(400).json({ message: "Fill username and password" });
    return;
  }

  const user = await User.findOne({ username });
  if (user !== null) {
    //found the user, it already exists
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = await User.create({
    username,
    password: hashedPassword,
  });
  res.status(200).json(newUser);
});

//Setting up login_______________________________________________________
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(400).json({ message: "Fill username and password" });
    return;
  }
  const user = await User.findOne({ username });
  if (user === null) {
    res.status(401).json({ message: "Invalid login" }); //yes on Postman
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    //passwords match - login successful
    req.session.currentUser = user;
    res.status(200).json(user);
  } else {
    res.status(401).json({ message: "Invalid login" }); //yes on Postman
  }
});

//Setting up logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "User logged out"}); //yes on Postman
});

router.get("/isLoggedIn", (req, res) => {
  if(req.session.currentUser) {
      res.status(200).json(req.session.currentUser);
  } else {
      res.status(200).json({}); //yes on Postman
  }
});

module.exports = router;