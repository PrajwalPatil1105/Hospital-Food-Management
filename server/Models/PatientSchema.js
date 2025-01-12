const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  disease: {
    type: String,
    required: true,
  },
  allergies: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  bedNumber: {
    type: String,
    required: true,
  },
  floorNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  contact: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  lastMealTime: {
    type: Date,
    default: null,
  },
  lastMealStatus: {
    type: String,
    enum: [
      "Pending",
      "Preparing",
      "Ready",
      "Delivered",
      "On The Way",
      "Cancelled",
    ],
    default: "Pending",
  },
  dietChart: {
    morning: {
      items: [String],
      instructions: String,
    },
    evening: {
      items: [String],
      instructions: String,
    },
    night: {
      items: [String],
      instructions: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Patient = new mongoose.model("Patient", patientSchema);
module.exports = Patient;
