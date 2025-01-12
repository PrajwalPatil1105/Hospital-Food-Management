const mongoose = require("mongoose");

const deliveryStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Available", "Engaged"],
    default: "Available",
  },
  contact: { type: String, required: true },
  currentDelivery: {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    mealTime: String,
    assignedAt: Date,
  },
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

const DeliveryStaff = mongoose.model("DeliveryStaff", deliveryStaffSchema);
module.exports = DeliveryStaff;
