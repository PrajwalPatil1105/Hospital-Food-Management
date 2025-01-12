import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ManagerDashboard.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ManagerDashboard() {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [staff, setSatff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Staffloading, setStaffLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchStaff();
  }, []);

  async function fetchPatients() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/HFM/patients`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.code === "3") {
        toast.error("You Are Not Authorized, Please LogIn", {
          duration: 1000,
        });
        setTimeout(() => {
          navigate("/ManagerStafflogin");
        }, 1400);
      } else {
        setPatients(data.patients);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients");
      setLoading(false);
    }
  }
  async function fetchStaff() {
    try {
      const response = await fetch(`${BASE_URL}/HFM/pantrystaff`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      setSatff(data?.staff);
      setStaffLoading(false);
    } catch (error) {
      console.error("Error fetching Staff:", error);
      toast.error("Failed to fetch Satff");
      setStaffLoading(false);
    }
  }

  async function Delete(id) {
    if (confirm("Want to Delete Patient Data??")) {
      try {
        const response = await fetch(`${BASE_URL}/deletepatient/${id}`, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(data?.message);
          fetchPatients();
        } else {
          toast.error("Data Not Deleted");
        }
      } catch (error) {
        console.error("Error fetching Staff:", error);
        toast.error("Failed to fetch Satff");
        setStaffLoading(false);
      }
    }
  }

  const handleAssignStaff = async (staffMember) => {
    try {
      const patientData = {
        patientId: selectedPatient._id,
        patientName: selectedPatient.name,
        bedNumber: selectedPatient.bedNumber,
        floorNumber: selectedPatient.floorNumber,
        roomNumber: selectedPatient.roomNumber,
        dietChart: selectedPatient.dietChart,
        emergencyContact: selectedPatient.emergencyContact,
        gender: selectedPatient.gender,
        status: selectedPatient.lastMealStatus,
      };
      const response = await fetch(
        `${BASE_URL}/HFM/pantrystaff/assign/${staffMember._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to assign staff");
      }
      toast.success("Staff assigned successfully");
      setShowAssignModal(false);
      setSelectedPatient(null);
      fetchStaff();
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast.error("Failed to assign staff");
    }
  };

  function logout() {
    if (confirm("Do You Want to Logout")) {
      localStorage.clear();
      toast.success("Logged Out Successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <h1>Manager Dashboard</h1>
        </div>
        <div className={styles.navLinks}>
          <button
            className={`${styles.navBtn} ${
              activeTab === "patients" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("patients")}
          >
            Patients
          </button>
          <button
            className={`${styles.navBtn} ${
              activeTab === "staff" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("staff")}
          >
            Pantry Staff
          </button>
          <Link to="/AddPatient" className={styles.addBtn}>
            Add Patient
          </Link>
          <Link to="/AddPantryStaff" className={styles.addBtn}>
            Add Pantry Staff
          </Link>
          <Link to="/AddDeliveryStaff" className={styles.addBtn}>
            Add Delivery Staff
          </Link>
          <button className={styles.logout} onClick={logout}>
            Log Out
          </button>
        </div>
      </nav>

      <main className={styles.content}>
        {activeTab === "patients" ? (
          <div>
            {loading ? (
              <div className={styles.loading}>Loading Patients...</div>
            ) : patients?.length > 0 ? (
              <div className={styles.patientGrid}>
                {patients.map((patient) => (
                  <div key={patient._id} className={styles.patientCard}>
                    <div className={styles.cardHeader}>
                      <h3>{patient.name}</h3>
                      <span className={styles.status}>
                        {patient.lastMealStatus || "Pending"}
                      </span>
                    </div>
                    <div className={styles.cardBody}>
                      <p>
                        Room: {patient.roomNumber} | Bed: {patient.bedNumber} |
                        Floor: {patient.floorNumber}
                      </p>
                      <p>Disease: {patient.disease}</p>
                      <p>Doctor: {patient.doctorName}</p>
                      <p>Emergency Contact : {patient.emergencyContact}</p>
                      <p>
                        Last Meal: {patient.lastMealTime || "No meal recorded"}
                      </p>
                      <div className={styles.mealPlans}>
                        <h4>Today's Meals</h4>
                        <div className={styles.mealTimes}>
                          {Object.entries(patient.dietChart).map(
                            ([time, mealData]) => (
                              <div key={time} className={styles.mealTime}>
                                <h5>{time}</h5>
                                <p className={styles.instructions}>
                                  <small>{mealData.instructions}</small>
                                </p>
                                <ul>
                                  {mealData.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <p className={styles.note}>
                        <strong>Note:</strong> {patient.note}
                      </p>
                    </div>
                    <button
                      className={styles.assignBtn}
                      disabled={
                        patient.lastMealStatus !== "Pending" &&
                        patient.lastMealStatus !== "Delivered"
                      }
                      style={{
                        cursor:
                          patient.lastMealStatus === "Pending" ||
                          patient.lastMealStatus === "Delivered"
                            ? "pointer"
                            : "not-allowed",
                        backgroundColor:
                          patient.lastMealStatus === "Pending" ||
                          patient.lastMealStatus === "Delivered"
                            ? "#3498db"
                            : "rgb(97, 161, 97)",
                      }}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowAssignModal(true);
                      }}
                    >
                      {patient.lastMealStatus === "Pending" ||
                      patient.lastMealStatus === "Delivered"
                        ? "Assign Staff"
                        : "Staff Assigned"}
                    </button>
                    <div className={styles.edit}>
                      <button
                        onClick={() =>
                          navigate("/EditPatient", {
                            state: { id: patient._id },
                          })
                        }
                        className={styles.eidtsBtn}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.eidtsBtn}
                        onClick={() => Delete(patient._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noPatients}>No Patients Found</div>
            )}
          </div>
        ) : (
          <div className={styles.staffGrid}>
            {activeTab === "staff" ? (
              <div>
                {Staffloading ? (
                  <div className={styles.loading}>Loading Staff...</div>
                ) : staff?.length > 0 ? (
                  <div className={styles.staffGrid}>
                    {staff.map((staffMember) => (
                      <div key={staffMember._id} className={styles.staffCard}>
                        <div className={styles.cardHeader}>
                          <h3>{staffMember.name}</h3>
                          <span
                            className={`${styles.staffStatus} ${
                              staffMember.status === "Available"
                                ? styles.available
                                : styles.busy
                            }`}
                          >
                            {staffMember.status}
                          </span>
                        </div>
                        <div className={styles.cardContent}>
                          <p>
                            <strong>Employee ID:</strong>{" "}
                            {staffMember.employeeId}
                          </p>
                          <p>
                            <strong>Email:</strong> {staffMember.email}
                          </p>
                          <p>
                            <strong>Location:</strong> {staffMember.location}
                          </p>
                          <div className={styles.taskSection}>
                            <p>
                              <strong>Tasks Assigned:</strong>
                            </p>
                            {staffMember.taskAssigned.length > 0 ? (
                              <ul className={styles.taskList}>
                                {staffMember.taskAssigned.map((task, index) => (
                                  <li key={index}>Task {index + 1}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className={styles.noTasks}>
                                No tasks currently assigned
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noStaff}>No Staff Members Found</div>
                )}
              </div>
            ) : null}
          </div>
        )}
        {showAssignModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Assign Staff to "{selectedPatient?.name}"</h2>
                <button
                  className={styles.closeBtn}
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPatient(null);
                  }}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.staffSelectionGrid}>
                  {staff.map((staffMember) => (
                    <div
                      key={staffMember._id}
                      className={`${styles.staffSelectionCard} ${
                        staffMember.status === "Engaged" ? styles.disabled : ""
                      }`}
                      onClick={() => {
                        if (staffMember.status !== "Engaged") {
                          handleAssignStaff(staffMember);
                        }
                      }}
                    >
                      <h3>{staffMember.name}</h3>
                      <p>
                        <strong>Employee ID:</strong> {staffMember.employeeId}
                      </p>
                      <p>
                        <strong>Status:</strong> {staffMember.status}
                      </p>
                      <p>
                        <strong>Current Tasks:</strong>{" "}
                        {staffMember.taskAssigned.length}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
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

export default ManagerDashboard;
