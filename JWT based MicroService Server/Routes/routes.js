require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const authHandler = require("../auth/auth")
// const db = require("../config/database");
// db.connect();

const router = express.Router();

router.route("/").get((req,res)=>{
    res.status(201).send("Response Sent back properly");
})

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !email || !password) {
      res.status(400).send("All inputs are required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(409).send({
        message: "User exists with given mail id, please use another email",
      });
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });
    //await User.deleteMany({});
    const token = jwt.sign(
      { user_id: user._id, email: email, isAdmin : false },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    res.status(201).json({ token: token });
  } catch (e) {
    console.error(e);
  }
});

//For logging in the user
router.post("/login", async (req, res) => {
  var { email, password } = req.body;
  var user = await User.findOne({ email });
  console.log(email,password);
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.status(400).send({ message: "Password comparison error :" + err });
    } 
    else if (result) {
      const token = jwt.sign(
        { user_id: user._id, email: user.email, isAdmin: false },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2H",
        }
      );

      const refreshToken = jwt.sign(
        { user_id: user._id, email: user.email, isAdmin: false },
        process.env.REFRESH_KEY,
        {
          expiresIn: "1D",
        }
      );

      res.status(200).send({
          message: "Password Matched",
          token: token,
          refreshToken: refreshToken,
        });
    } else {
      res.status(400).send({ message: "Password is incorrect" });
    }
  });
});

router.post("/resources", authHandler.authHandler, (req,res)=>{
    res.send("Successfull");
})
router.post("/admin", authHandler.adminAuthHandler, (req,res)=>{
    res.send("Successfull");
})

module.exports = router;