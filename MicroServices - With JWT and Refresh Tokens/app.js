require("dotenv").config();
db = require("./config/database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const authHandler = require("./auth/auth")
db.connect();

const app = express();
app.use(express.json());
app.use("/", (req, res, next) => {
  console.log("Request In Coming");
  next();
});
app.get("/", (req, res) => {
  res.send("Sending a signal");
});

app.post("/register", async (req, res) => {
  console.log("Registering....");
  console.log(req.body);
  try {
    const { first_name, last_name, email, password } = req.body;
    encryptedPassword = await bcrypt.hash(password, 10);
    if (!first_name || !email || !password) {
      res.status(400).send("All inputs are required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(409).send({
        message: "User exists with given mail id, please use another email",
      });
    } else {
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });
      //await User.deleteMany({});

      const token = jwt.sign(
        { user_id: user._id, email: email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      //console.log(user);
      res.status(201).json({ token: token });
    }
  } catch (e) {
    console.error(e);
  }
});
app.post("/login", async (req, res) => {
  var { email, password } = req.body;
  var user = await User.findOne({ email });
  bcrypt.compare(password, user.password, (err, result) => {
    //console.log(user);
    //console.log(result);
    if (err) {
      res.status(400).send({ message: "Password comparison error :" + err });
    } else if (result) {

      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1S",
        }
      );

      const refreshToken = jwt.sign(
        { user_id: user._id,  email: user.email },
        process.env.REFRESH_KEY,
        {
          expiresIn: "1D",
        }
      );


      res.status(200).send({message : "Password Matched", token: token, refreshToken : refreshToken});
    } else {
      res.status(400).send({ message: "Password is incorrect" });
    }
  });
});
app.post("/resources", authHandler, (req,res)=>{
  res.send("Successfull");
})
app.use((req, res) => {
  res.sendStatus(404);
});
module.exports = app;
