import React, { useEffect, useState } from "react";
import styles from "./PantryDashboard.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MEAL_STATUS_OPTIONS = [
  "Pending",
  "Preparing",
  "Ready",
  "On The Way",
  "Cancelled",
];

const PantryDashboard = () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [name, setname] = useState("");
  const [staff, setSatff] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchStaff();
    console.log(tasks);
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/HFM/pantry/dashboard`, {
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
          navigate("/PantryStafflogin");
        }, 1400);
      } else {
        setTasks(data?.Staff?.taskAssigned || []);
        setname(data?.Staff?.name);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const updateMealStatus = async (patientId, newStatus) => {
    try {
      const response = await fetch(
        `${BASE_URL}/HFM/patient/${patientId}/meal-status`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ lastMealStatus: newStatus }),
        }
      );
      if (response.ok) {
        toast.success(`Meal status updated to ${newStatus}`);
        fetchDashboardData();
      } else {
        toast.error("Failed to update meal status");
      }
    } catch (error) {
      console.error("Error updating meal status:", error);
      toast.error("Failed to update meal status");
    }
  };

  const handleAssignStaff = async (staffMember) => {
    const token = localStorage.getItem("token");
    try {
      const patientData = tasks[0];
      const response = await fetch(
        `${BASE_URL}/HFM/Deliverystaff/assign/${staffMember._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(patientData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to assign staff");
      }
      toast.success("Staff assigned successfully");
      updateMealStatus(tasks[0].patientId, "On The Way");
      setShowAssignModal(false);
      setSelectedPatient(null);
      fetchStaff();
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast.error("Failed to assign staff");
    }
  };

  async function fetchStaff() {
    try {
      const response = await fetch(`${BASE_URL}/HFM/Deliverystaff`, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      setSatff(data?.staff);
    } catch (error) {
      console.error("Error fetching Staff:", error);
      toast.error("Failed to fetch Satff");
    }
  }

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
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <h1>Pantry Staff Dashboard</h1>
        <div className={styles.tabs}>
          <p>{name}</p>
          <button className={styles.logout} onClick={logout}>
            Log Out
          </button>
        </div>
      </nav>
      <main className={styles.content}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading tasks...</p>
          </div>
        ) : !tasks.length ? (
          <div className={styles.emptyContainer}>
            <h2>No Tasks Assigned</h2>
            <p>There are currently no meal deliveries assigned to you.</p>
          </div>
        ) : (
          <div className={styles.taskGrid}>
            {tasks.map((task) => (
              <div key={task.patientId} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <h3>{task.patientName}</h3>
                  <p>
                    Room: {task.roomNumber} | Bed: {task.bedNumber} | Floor:{" "}
                    {task.floorNumber}
                  </p>
                </div>

                <div className={styles.taskDetails}>
                  <h4 className={styles.taskStatusHeading}>Meal Status</h4>
                  <select
                    className={styles.statusDropdown}
                    value={task.lastMealStatus}
                    onChange={(e) =>
                      updateMealStatus(task.patientId, e.target.value)
                    }
                  >
                    {MEAL_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <div className={styles.dietChart}>
                    {["morning", "evening", "night"].map(
                      (mealTime) =>
                        task.dietChart[mealTime] && (
                          <div
                            key={mealTime}
                            className={`${styles.mealTime} ${
                              styles[`${mealTime}Meal`]
                            }`}
                          >
                            <h5 className={styles.mealTimeTitle}>
                              {mealTime.charAt(0).toUpperCase() +
                                mealTime.slice(1)}{" "}
                              Chart
                            </h5>
                            <ul className={styles.mealItems}>
                              {task.dietChart[mealTime].items.map(
                                (item, index) => (
                                  <li key={index}>{item}</li>
                                )
                              )}
                            </ul>
                            <p className={styles.instructions}>
                              Instructions:{" "}
                              {task.dietChart[mealTime].instructions}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.assignButton}`}
                    onClick={() => {
                      setSelectedPatient(task);
                      setShowAssignModal(true);
                    }}
                  >
                    Assign Delivery Staff
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showAssignModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2>Assign Delivery Staff to "{tasks[0]?.patientName}"</h2>
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
};

export default PantryDashboard;
