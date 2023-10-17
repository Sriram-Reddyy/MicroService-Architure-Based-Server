require("dotenv").config();
db = require("./config/database");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
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
      res.sendStatus(409)
    } else {
      const user = User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
      res.send(user);
    }
  } catch (e) {
    console.error(e);
  }
});
app.get("/login", (req, res) => {});
app.use((req, res) => {
  res.sendStatus(404);
});
module.exports = app;
