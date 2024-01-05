import "./Login.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import LTlogo from "./components/images/LT_logo.svg";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation logic for missing fields
    if (!email && !password) {
      setErrorMessage("Please enter an email and password.");
      return;
    } else if (!email) {
      setErrorMessage("Please enter an email.");
      return;
    } else if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    // Clear any previous error messages
    setErrorMessage("");

    // Rest of submit logic
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        // Handle the 401 status by checking the response from the server
        if (error.response.status === 401) {
          setErrorMessage("Incorrect email or password.");
        } else {
          // For other status codes, you can implement additional logic here
          setErrorMessage(
            "An error occurred during login. Please try again later."
          );
        }
      } else {
        console.error("Login error:", error);
        setErrorMessage(
          "An error occurred during login. Please try again later."
        );
      }
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/protected`, {
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
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <div className="login-section">
      <Navbar />

      <form onSubmit={handleSubmit} className="login-form">
        <img src={LTlogo} className="logo-img" alt="LT Logo" />
        {/* Display an error message if it exists */}
        {errorMessage && <div className="alert-error">{errorMessage}</div>}
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
