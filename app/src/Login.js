import "./Login.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import LTlogo from "./components/images/LT_logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);

        navigate("/dashboard");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // if your API requires credentials
        });

        if (response.ok) {
          navigate("/dashboard");
        } else {
          // If the token is not valid, remove it from localStorage
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error validating token", error);
        localStorage.removeItem("token");
      } finally {
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <div className="login-section">
      <Navbar />
      <form onSubmit={handleSubmit} className="login-form">
        <img src={LTlogo} className="logo-img" />
        <div className="input-class">
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-class">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
