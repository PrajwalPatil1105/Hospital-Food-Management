import React, { useEffect, useState } from "react";
import styles from "./DeliveryDashboard.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DeliveryDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://hospital-food-management-g4gs.onrender.com/HFM/Delivery/dashboard",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.code === "3") {
        toast.error("You Are Not Authorized, Please LogIn", {
          duration: 1000,
        });
        setTimeout(() => {
          navigate("/DeliveryStafflogin");
        }, 1400);
      }
      setTasks(data?.Staff?.taskAssigned || []);
      setName(data?.Staff?.name);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const updateMealStatus = async (patientId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `https://hospital-food-management-g4gs.onrender.com/HFM/patientD/${patientId}/meal-status`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lastMealStatus: newStatus }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(`Meal status updated to ${newStatus}`);
        fetchDashboardData();
      } else {
        console.error("Server error:", result);
        toast.error("Failed to update meal status");
      }
    } catch (error) {
      console.error("Error updating meal status:", error);
      toast.error("Failed to update meal status");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading tasks...</p>
        </div>
      );
    }

    if (!tasks.length) {
      return (
        <div className={styles.emptyContainer}>
          <h2>No Tasks Assigned</h2>
          <p>There are currently no meal deliveries assigned to you.</p>
        </div>
      );
    }

    return (
      <div className={styles.deliveryGrid}>
        {tasks.map((task) => (
          <div key={task._id} className={styles.deliveryCard}>
            <div className={styles.patientInfo}>
              <h3 className={styles.patientName}>{task.patientName}</h3>
              <span className={styles.patientDetails}>
                Room {task.roomNumber} • Bed {task.bedNumber} • Floor{" "}
                {task.floorNumber}
              </span>
            </div>

            <div className={styles.mealSection}>
              <div className={styles.mealTime}>
                <h4>Morning</h4>
                <ul className={styles.mealItems}>
                  {task.dietChart.morning.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className={styles.instructions}>
                  {task.dietChart.morning.instructions}
                </p>
              </div>

              <div className={styles.mealTime}>
                <h4>Evening</h4>
                <ul className={styles.mealItems}>
                  {task.dietChart.evening.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className={styles.instructions}>
                  {task.dietChart.evening.instructions}
                </p>
              </div>

              <div className={styles.mealTime}>
                <h4>Night</h4>
                <ul className={styles.mealItems}>
                  {task.dietChart.night.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className={styles.instructions}>
                  {task.dietChart.night.instructions}
                </p>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.contactInfo}>
                <span>Emergency Contact: {task.emergencyContact}</span>
                <span>Gender: {task.gender}</span>
              </div>
              <button
                className={styles.deliverButton}
                onClick={() => updateMealStatus(task.patientId, "Delivered")}
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    );
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
    <div className={styles.dashboard}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.navTitle}>Hospital Food Delivery</h1>
          <div className={styles.staffInfo}>
            <span className={styles.staffName}>{name || "Staff Member"}</span>
            <button className={styles.logout} onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <main className={styles.content}>{renderContent()}</main>
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

export default DeliveryDashboard;
