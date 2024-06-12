import "./Homepage.css";
import Navbar from "./components/Navbar";
import admin_img from "./components/images/admin.png";
import cocopah_img from "./components/images/cocopah_img.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function Homepage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(true);
  const [cocopahDB, setCocopahDB] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
     return true;
    };

    validateToken();
  }, [navigate]);

  return (
    <div className="homepage-content">
      <Navbar />
      <div className="box-section">
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
        {cocopahDB && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/cocopah_database_management");
            }}
          >
            <div className="img-div" id="cocopah_img">
              <img src={cocopah_img} alt="cocopah DB service" />
            </div>
            <div className="card-info">
              <h4>Cocopah Database Management Tool</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;
