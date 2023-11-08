import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

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
        const response = await fetch("/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // if your API requires credentials
        });
        console.log("checked token");

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // If the token is not valid, remove it from localStorage
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error validating token", error);
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

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
