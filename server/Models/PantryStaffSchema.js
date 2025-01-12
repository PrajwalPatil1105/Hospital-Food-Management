const mongoose = require("mongoose");

const pantryStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Available", "Engaged"],
    default: "Available",
  },
  location: { type: String, required: true },
  taskAssigned: [
    {
      patientId: { type: String, default: "" },
      patientName: { type: String, default: "" },
      bedNumber: { type: String, default: "" },
      floorNumber: { type: String, default: "" },
      roomNumber: { type: String, default: "" },
      dietChart: { type: Object, default: "" },
      emergencyContact: { type: String, default: "" },
      gender: { type: String, default: "" },
      status: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const PantryStaff = new mongoose.model("PantryStaff", pantryStaffSchema);
module.exports = PantryStaff;
