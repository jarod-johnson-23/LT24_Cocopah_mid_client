import "./Login.css";
import React, { useState } from "react";
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
        localStorage.setItem("access", JSON.stringify(response.data.access));
        console.log(response.data.access);
        navigate("/dashboard");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
