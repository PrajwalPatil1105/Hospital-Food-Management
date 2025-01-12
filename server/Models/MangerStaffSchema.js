const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "manager" },
  createdAt: { type: Date, default: Date.now },
});

const Manager = new mongoose.model("Manager", managerSchema);
module.exports = Manager;
