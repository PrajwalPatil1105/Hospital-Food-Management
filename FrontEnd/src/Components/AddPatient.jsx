import React, { useState } from "react";
import styles from "./AddPatient.module.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function AddPatient() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const [patientData, setPatientData] = useState({
    name: "",
    disease: "",
    allergies: "",
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    age: "",
    gender: "",
    contact: "",
    emergencyContact: "",
    doctorName: "",
    note: "",
    dietChart: {
      morning: { items: [], instructions: "" },
      evening: { items: [], instructions: "" },
      night: { items: [], instructions: "" },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/HFM/addPatient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setPatientData({
          name: "",
          disease: "",
          allergies: "",
          roomNumber: "",
          bedNumber: "",
          floorNumber: "",
          age: "",
          gender: "",
          contact: "",
          emergencyContact: "",
          doctorName: "",
          note: "",
          dietChart: {
            morning: { items: [], instructions: "" },
            evening: { items: [], instructions: "" },
            night: { items: [], instructions: "" },
          },
        });
        setTimeout(() => {
          navigate("/manager");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add patient. Please try again.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={styles.formSection}>
          <h3>Personal Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Patient Name</label>
              <input
                type="text"
                value={patientData.name}
                onChange={(e) =>
                  setPatientData({ ...patientData, name: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Age</label>
              <input
                type="text"
                value={patientData.age}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    age: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                value={patientData.gender}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    gender: e.target.value,
                  })
                }
              >
                <option value="" disabled selected hidden>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Disease</label>
              <input
                type="text"
                value={patientData.disease}
                onChange={(e) =>
                  setPatientData({ ...patientData, disease: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Allergies</label>
              <input
                type="text"
                value={patientData.allergies}
                onChange={(e) =>
                  setPatientData({ ...patientData, allergies: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Room Number</label>
              <input
                type="text"
                value={patientData.roomNumber}
                onChange={(e) =>
                  setPatientData({ ...patientData, roomNumber: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Bed Number</label>
              <input
                type="text"
                value={patientData.bedNumber}
                onChange={(e) =>
                  setPatientData({ ...patientData, bedNumber: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Floor Number</label>
              <input
                type="text"
                value={patientData.floorNumber}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    floorNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contact</label>
              <input
                type="text"
                value={patientData.contact}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    contact: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Emergency Contact</label>
              <input
                type="text"
                value={patientData.emergencyContact}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    emergencyContact: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Doctor Name</label>
              <input
                type="text"
                value={patientData.doctorName}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    doctorName: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label>Any Note</label>
              <input
                type="text"
                value={patientData.note}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    note: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Diet Chart</h3>
          {["morning", "evening", "night"].map((mealTime) => (
            <div key={mealTime} className={styles.mealSection}>
              <h4>
                {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Meal
              </h4>
              <div className={styles.formGroup}>
                <label>Items (comma-separated)</label>
                <input
                  type="text"
                  onChange={(e) => {
                    const items = e.target.value
                      .split(",")
                      .map((item) => item.trim());
                    setPatientData({
                      ...patientData,
                      dietChart: {
                        ...patientData.dietChart,
                        [mealTime]: {
                          ...patientData.dietChart[mealTime],
                          items,
                        },
                      },
                    });
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Special Instructions</label>
                <textarea
                  onChange={(e) => {
                    setPatientData({
                      ...patientData,
                      dietChart: {
                        ...patientData.dietChart,
                        [mealTime]: {
                          ...patientData.dietChart[mealTime],
                          instructions: e.target.value,
                        },
                      },
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className={styles.submitButton}>
          Register Patient
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

export default AddPatient;
