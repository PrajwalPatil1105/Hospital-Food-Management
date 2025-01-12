import React, { useState } from "react";
import styles from "./AddStaff.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddPantryStaff() {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    password: "",
    employeeId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hospital-food-management-g4gs.onrender.com/HFM/addpantrystaff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message);
        setTimeout(() => {
          navigate("/manager");
        }, 2000);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Failed to add Staff. Please try again.");
    }
  };
  return (
    <div className={styles.formContainer}>
      <h2>Add Pantry Staff</h2>
      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={staffData.name}
              onChange={(e) =>
                setStaffData({ ...staffData, name: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={staffData.email}
              onChange={(e) =>
                setStaffData({ ...staffData, email: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={staffData.password}
              onChange={(e) =>
                setStaffData({ ...staffData, password: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Contact</label>
            <input
              type="tel"
              value={staffData.contact}
              onChange={(e) =>
                setStaffData({ ...staffData, contact: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <input
              type="text"
              value={staffData.location}
              onChange={(e) =>
                setStaffData({ ...staffData, location: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Employe Id</label>
            <input
              type="text"
              value={staffData.employeeId}
              onChange={(e) =>
                setStaffData({ ...staffData, employeeId: e.target.value })
              }
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Register Pantry Staff
        </button>
      </form>
      <Toaster
        toastOptions={{
          style: {
            color: "white",
            backgroundColor: "#aaa",
            fontFamily: "Poppins",
            fontSize: "0.99em",
            fontWeight: "400",
            marginLeft: "1em",
          },
        }}
      />
    </div>
  );
}

export default AddPantryStaff;
