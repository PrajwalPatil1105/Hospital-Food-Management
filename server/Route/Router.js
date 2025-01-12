const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Manager = require("../Models/MangerStaffSchema");
const PantryStaff = require("../Models/PantryStaffSchema");
const DeliveryStaff = require("../Models/DeliveryStaffSchema");
const Patient = require("../Models/PatientSchema");
dotenv.config();

// ------------------------------------Middleware----------------------------------

const auth = (role) => {
  return async (req, res, next) => {
    try {
      console.log("Authorization Header:", req.header("Authorization"));
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res
          .status(401)
          .json({ message: "You are not authorizated", code: "3" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Not authorized", code: "3" });
      }
      req.staff = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid", code: "3" });
    }
  };
};

// -------------------------------------------------- LogIn ---------------------------------------------------

router.post("/Managerlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const token = jwt.sign(
      { id: manager._id, role: "manager", name: manager.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token, message: "Login Successfull", code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/Pantrylogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await PantryStaff.findOne({ email });

    if (!staff) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const token = jwt.sign(
      { id: staff._id, role: "PantryStaff", name: staff.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token, message: "Login Successfull", code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/Deliverylogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const Deliverystaff = await DeliveryStaff.findOne({ email });

    if (!Deliverystaff) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const isMatch = await bcrypt.compare(password, Deliverystaff.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Password/Email Incorrect", code: "0" });
    }
    const token = jwt.sign(
      {
        id: Deliverystaff._id,
        role: "DeliveryStaff",
        name: Deliverystaff.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token, message: "Login Successfull", code: "1" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------- Dashboard access with related data  -------------------------------------------------

router.get("/pantry/dashboard", auth("PantryStaff"), async (req, res) => {
  try {
    const staffId = req.staff.id;
    const Staff = await PantryStaff.findById(staffId);
    if (!Staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json({ Staff });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/Delivery/dashboard", auth("DeliveryStaff"), async (req, res) => {
  try {
    const staffId = req.staff.id;
    const Staff = await DeliveryStaff.findById(staffId);
    if (!Staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json({ Staff });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------------------- Adding New Staff and Patient -----------------------------------------------------

router.post("/addmanager", async (req, res) => {
  try {
    const { name, email, contact, location, password, employeeId } = req.body;
    const isUser = await Manager.findOne({ email });
    if (isUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({
      name,
      email,
      contact,
      location,
      password: hashpassword,
      employeeId,
    });
    await newManager.save();
    res.status(201).json(newManager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/addpantrystaff", async (req, res) => {
  try {
    const { name, email, contact, location, password, employeeId } = req.body;
    const isUser = await PantryStaff.findOne({ email });
    if (isUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newPantryStaff = new PantryStaff({
      name,
      email,
      contact,
      location,
      password: hashpassword,
      employeeId,
      taskAssigned: [],
    });
    await newPantryStaff.save();
    res.status(201).json({ message: "Staff Added Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/addDeliverystaff", async (req, res) => {
  try {
    const { name, email, contact, location, password, employeeId } = req.body;
    const isUser = await DeliveryStaff.findOne({ email });
    if (isUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newDeliveryStaff = new DeliveryStaff({
      name,
      email,
      contact,
      location,
      password: hashpassword,
      employeeId,
      taskAssigned: [],
    });

    await newDeliveryStaff.save();
    res.status(201).json({ message: "Staff Added Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/addPatient", async (req, res) => {
  try {
    const {
      name,
      disease,
      allergies,
      roomNumber,
      bedNumber,
      floorNumber,
      age,
      gender,
      contact,
      emergencyContact,
      doctorName,
      note,
      lastMealTime,
      lastMealStatus,
      dietChart,
    } = req.body;

    const newPatient = new Patient({
      name,
      disease,
      allergies,
      roomNumber,
      bedNumber,
      floorNumber,
      age,
      gender,
      contact,
      emergencyContact,
      doctorName,
      note,
      lastMealTime,
      lastMealStatus,
      dietChart,
    });

    await newPatient.save();
    res
      .status(201)
      .json({ message: "Patient added successfully", patient: newPatient });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add patient", error: error.message });
  }
});

// --------------------------------------------- Fetching All Patient and Staff Data ------------------------------------------------

router.get("/patients", auth("manager"), async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({ patients });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch patients", error: error.message });
  }
});

router.get("/pantrystaff", async (req, res) => {
  try {
    const staff = await PantryStaff.find();
    res.status(200).json({ staff });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch patients", error: error.message });
  }
});

router.get("/Deliverystaff", async (req, res) => {
  try {
    const staff = await DeliveryStaff.find();
    res.status(200).json({ staff });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch patients", error: error.message });
  }
});

// ----------------------------------------------------------- Assinging Tasks --------------------------------------

router.put("/pantrystaff/assign/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;
    const patientData = req.body;
    const staff = await PantryStaff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    staff.taskAssigned.push(patientData);
    staff.status = "Engaged";
    await staff.save();
    res.status(200).json({
      message: "Patient assigned successfully",
      staff,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign patient",
      error: error.message,
    });
  }
});

router.put(
  "/Deliverystaff/assign/:staffId",
  auth("PantryStaff"),
  async (req, res) => {
    try {
      const { staffId } = req.params;
      const patientData = req.body;
      const pantrystaffid = req.staff.id;
      const staff = await DeliveryStaff.findById(staffId);
      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
      staff.taskAssigned.push(patientData);
      staff.status = "Engaged";
      await staff.save();

      res.status(200).json({
        message: "Delivery assigned successfully",
      });

      await PantryStaff.findByIdAndUpdate(pantrystaffid, {
        status: "Available",
        taskAssigned: [],
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to assign patient",
        error: error.message,
      });
    }
  }
);

// ---------------------------------------------------------------- Live Meal Status Updation -------------------------------------------

router.patch("/patient/:patientId/meal-status", async (req, res) => {
  try {
    const { patientId } = req.params;
    const { lastMealStatus } = req.body;

    if (!lastMealStatus) {
      return res.status(400).json({ message: "Check Meal Status" });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.lastMealStatus = lastMealStatus;

    if (["Delivered"].includes(lastMealStatus)) {
      patient.lastMealTime = new Date();
    }
    await patient.save();
    res.status(200).json({
      message: "lastMealStatus updated successfully",
    });
  } catch (error) {
    console.error("Error updating lastMealStatus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.patch(
  "/patientD/:patientId/meal-status",
  auth("DeliveryStaff"),
  async (req, res) => {
    try {
      const { patientId } = req.params;
      const { lastMealStatus } = req.body;
      const staffId = req.staff?.id;
      if (!lastMealStatus) {
        return res.status(400).json({ message: "Check Meal Status" });
      }
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      patient.lastMealStatus = lastMealStatus;

      if (lastMealStatus === "Delivered") {
        patient.lastMealTime = new Date();
      }

      await DeliveryStaff.findByIdAndUpdate(staffId, {
        status: "Available",
        taskAssigned: [],
      });

      await patient.save();
      res.status(200).json({
        message: "lastMealStatus updated successfully",
      });
    } catch (error) {
      console.error("Error updating lastMealStatus:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
