import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { API_BASE_URL } from "./config";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/protected`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // if your API requires credentials
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // If the token is not valid, remove it from localStorage
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validating token", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Navbar />
      </div>
    ); // Or some other loading indicator
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
