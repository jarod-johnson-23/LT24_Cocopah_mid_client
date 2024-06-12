import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust the import according to your project structure
import { API_BASE_URL } from "./config";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check-token`, {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
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
        {/* Add a loading indicator here if needed */}
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
