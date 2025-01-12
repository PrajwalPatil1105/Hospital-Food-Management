import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DeliveryLogin.module.css";
import toast, { Toaster } from "react-hot-toast";

function DeliveryLogin() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hospital-food-management-g4gs.onrender.com/HFM/Deliverylogin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (data?.code === "1") {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        setTimeout(() => {
          navigate("/delivery");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}></div>
      <div className={styles.loginCardSection}>
        <div className={styles.loginCard}>
          <h2>Delivery Personal Login</h2>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="employId">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
        </div>
        <Toaster
          toastOptions={{
            style: {
              color: "white",
              backgroundColor: "#aaa",
              fontFamily: "Poppins",
              fontSize: "0.99em",
              fontWeight: "400",
              marginLeft: "49%",
            },
          }}
        />
      </div>
    </div>
  );
}

export default DeliveryLogin;
