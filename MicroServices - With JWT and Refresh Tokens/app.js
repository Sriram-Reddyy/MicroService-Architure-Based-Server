require("dotenv").config();
const express = require("express");
const router = require("./Routes/routes.js")
const db = require("./config/database");
db.connect();

const app = express();
app.use(express.json());

app.use("/", (req, res, next) => {
  console.log("Request In Coming");
  next();
});
app.use(router);
app.use((req, res) => {
  res.sendStatus(404);
});
module.exports = app;
