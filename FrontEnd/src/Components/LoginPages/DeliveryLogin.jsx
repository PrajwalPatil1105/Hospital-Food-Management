import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DeliveryLogin.module.css";
import toast, { Toaster } from "react-hot-toast";
import { Truck, Package, Mail, Lock } from "lucide-react";

function DeliveryLogin() {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/HFM/Deliverylogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
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
      <div className={styles.illustrationSection}>
        <div className={styles.iconContainer}>
          <Truck className={styles.truckIcon} size={64} />
          <div className={styles.floatingPackages}>
            <Package className={styles.package1} size={24} />
            <Package className={styles.package2} size={32} />
            <Package className={styles.package3} size={28} />
          </div>
        </div>
        <h1 className={styles.welcomeText}>Delivery Staff Portal</h1>
        <p className={styles.subText}>
          Ensuring timely and safe meal delivery to patients
        </p>
      </div>
      <div className={styles.loginCardSection}>
        <div className={styles.loginCard}>
          <h2>Delivery Staff Login</h2>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                <Mail size={18} className={styles.inputIcon} />
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">
                <Lock size={18} className={styles.inputIcon} />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
                placeholder="Enter your password"
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
