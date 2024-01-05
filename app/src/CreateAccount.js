import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LTlogo from "./components/images/LT_logo.svg";
import "./CreateAccount.css";
import { API_BASE_URL } from "./config";

const CreateAccount = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false); // New state to track password error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/verify-token/${token}`
        );
        setIsValidToken(true);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error verifying token", error);
        setIsValidToken(false);
      }
    };
    if (token) {
      verifyToken();
    }
  }, [token]);

  if (!isValidToken) {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "50px 0 5px 0" }}>
            Your link has expired or is invalid
          </h2>
          <p>Please request a new link from an admin</p>
        </div>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    // If password is not provided, set the error state to true and prevent form submission
    if (!password) {
      setShowPasswordError(true);
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, {
        email,
        password,
        firstName, // Add the first name to the request
        lastName, // Add the last name to the request
        role, // Add the role to the request
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else if (response.status === 409) {
        console.error("Email is already registered");
      } else if (response.status === 400) {
        console.error("ERROR");
      } else {
        console.log(response.status);
        console.error("Generic Error MSG");
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleCreate} className="login-form">
        <img src={LTlogo} className="logo-img" alt="LT Logo" />
        <div className="input-class">
          <label>Email: </label>
          <input type="text" id="disabled-input" value={email} disabled />
        </div>
        <div className="input-class">
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Add inputs for first name, last name, and role */}
        <div className="input-class">
          <label>First Name: </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="input-class">
          <label>Last Name: </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="input-class">
          <label>Role: </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        {showPasswordError && (
          <div className="alert-error">
            A password is required to create an account.
          </div>
        )}
        <button type="submit" className="login-btn">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
