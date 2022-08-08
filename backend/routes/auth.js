const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');


//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});
    !user && res.status(400).json("Wrong Credentials");

    const passValidation = await bcrypt.compare(req.body.password, user.password);
    !passValidation && res.status(400).json("Wrong Credentials");

    const {password, ...other} = user._doc;

    res.status(200).json(user);

  } catch (error) {
    
  }

});


module.exports = router;