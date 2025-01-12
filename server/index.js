const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("../server/Route/Router.js");

app.use(express.json());
dotenv.config();

app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected Succefully");
  })
  .catch((err) => {
    console.log("Error In Connecting  :", err);
  });

app.use("/HFM", router);

app.listen(4000, (req, res) => {
  console.log("Listing to 4000");
});
