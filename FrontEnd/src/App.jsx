import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import ManagerDashboard from "./Components/ManagerDashboard";
import PantryDashboard from "./Components/PantryDashboard";
import DeliveryDashboard from "./Components/DeliveryDashboard";
import ManagerLogin from "./Components/LoginPages/ManagerLogin";
import PantryLogin from "./Components/LoginPages/PantryLogin";
import DeliveryLogin from "./Components/LoginPages/DeliveryLogin";
import AddPatient from "./Components/AddPatient";
import AddPantryStaff from "./Components/AddPantryStaff";
import AddDeliveryStaff from "./Components/AddDeliveryStaff";
import EditPatient from "./Components/EditPatient";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/pantry" element={<PantryDashboard />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/ManagerStafflogin" element={<ManagerLogin />} />
        <Route path="/PantryStafflogin" element={<PantryLogin />} />
        <Route path="/DeliveryStafflogin" element={<DeliveryLogin />} />
        <Route path="/AddPatient" element={<AddPatient />} />
        <Route path="/AddPantryStaff" element={<AddPantryStaff />} />
        <Route path="/AddDeliveryStaff" element={<AddDeliveryStaff />} />
        <Route path="/EditPatient" element={<EditPatient />} />
      </Routes>
    </Router>
  );
}

export default App;
