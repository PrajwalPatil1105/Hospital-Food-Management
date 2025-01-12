import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerLogin.module.css";
import toast, { Toaster } from "react-hot-toast";
import { ClipboardList, Users, BarChart3 } from "lucide-react";

function ManagerLogin() {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/HFM/Managerlogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data?.code === "1") {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        setTimeout(() => {
          navigate("/manager");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.imageSection}>
        <div className={styles.iconContainer}>
          <ClipboardList size={64} className={styles.icon} />
          <Users size={48} className={styles.usersIcon} />
          <BarChart3 size={48} className={styles.chartIcon} />
        </div>
        <div className={styles.textContent}>
          <h1>Welcome Manager!</h1>
          <p>Access your dashboard to manage operations</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span>✓</span> Monitor team performance
            </div>
            <div className={styles.feature}>
              <span>✓</span> Track inventory levels
            </div>
            <div className={styles.feature}>
              <span>✓</span> Generate reports
            </div>
          </div>
        </div>
      </div>
      <div className={styles.loginCardSection}>
        <div className={styles.loginCard}>
          <h2>Manager Login</h2>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
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
  );
}

export default ManagerLogin;
