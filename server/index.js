const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("../server/Route/Router.js");

app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: [
      "https://hospital-food-management-coral.vercel.app",
      "http://localhost:5173",
    ],
  })
);

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
  console.log("Started...");
});
