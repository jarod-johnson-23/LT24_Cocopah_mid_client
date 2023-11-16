import "./Homepage.css";
import Navbar from "./components/Navbar";
import zip_heatmap_img from "./components/images/zipcode_heatmap_img.png";
import toyota_img from "./components/images/toyota.jpeg";
import admin_img from "./components/images/admin.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Homepage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [heatmap, setHeatmap] = useState(false);
  const [toyota, setToyota] = useState(false);
  const [admin, setAdmin] = useState(false);

  const getAccess = async (email) => {
    console.log(email);
    setEmail(email);
    const body = {
      email: email,
    };
    const response = await fetch("http://localhost:5000/get_access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      let access = data.access;
      setAdmin(access.admin || false);
      setHeatmap(access.heatmap || false);
      setToyota(access.toyota || false);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/protected", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          getAccess(data.logged_in_as);
        } else {
          // If the token is not valid, remove it from localStorage
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error validating token", error);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <div className="homepage-content">
      <Navbar />
      <div className="box-section">
        {heatmap && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/zipcode_heatmap");
            }}
          >
            <div className="img-div">
              <img src={zip_heatmap_img} alt="heatmap service" />
            </div>
            <div className="card-info">
              <h4>Heatmap Generator</h4>
            </div>
          </div>
        )}
        {toyota && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/toyota_media_buy_processing");
            }}
          >
            <div className="img-div">
              <img src={toyota_img} alt="toyota service" />
            </div>
            <div className="card-info">
              <h4>Toyota Media Buy Processing</h4>
            </div>
          </div>
        )}
        {admin && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/admin_tools");
            }}
          >
            <div className="img-div">
              <img src={admin_img} alt="admin service" />
            </div>
            <div className="card-info">
              <h4>Admin Tools</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
