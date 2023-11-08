import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LTlogo from "./components/images/LT_logo.png";
import "./CreateAccount.css";

const CreateAccount = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/verify-token/${token}`
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

  // Render the account creation form with the verified email address
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/register", {
        email,
        password,
      });
      if (response.ok) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else if (response.status === 409) {
        console.error("Email is already registered");
      } else if (response.status === 400) {
        console.error("ERROR");
      } else {
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
        <img src={LTlogo} className="logo-img" />
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
        <button type="submit" className="login-btn">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
