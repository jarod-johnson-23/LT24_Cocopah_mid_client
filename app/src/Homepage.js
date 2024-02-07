import "./Homepage.css";
import Navbar from "./components/Navbar";
import zip_heatmap_img from "./components/images/zipcode_heatmap_img.png";
import toyota_img from "./components/images/toyota.jpeg";
import admin_img from "./components/images/admin.png";
import beau_img from "./components/images/beau.png";
import lt_redirect_img from "./components/images/lt_redirect.jpg";
import basecamp_img from "./components/images/basecamp.jpg";
import cocopah_img from "./components/images/cocopah_img.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

function Homepage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [heatmap, setHeatmap] = useState(false);
  const [toyota, setToyota] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [beau, setBeau] = useState(false);
  const [lt_redirect, set_lt_redirect] = useState(false);
  const [bcMedia, setBcMedia] = useState(false);
  const [cocopahDB, setCocopahDB] = useState(false);

  const getAccess = async (email) => {
    console.log(email);
    setEmail(email);
    const body = {
      email: email,
    };
    const response = await fetch(`${API_BASE_URL}/users/get_access`, {
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
      setBeau(access.beau || false);
      set_lt_redirect(access.lt_redirect || false);
      setBcMedia(access.bcMedia || false);
      setCocopahDB(access.cocopah_db || false);
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
        const response = await fetch(`${API_BASE_URL}/users/protected`, {
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
        {beau && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/beau_joke");
            }}
          >
            <div className="img-div">
              <img src={beau_img} alt="admin service" />
            </div>
            <div className="card-info">
              <h4>Beau Joke</h4>
            </div>
          </div>
        )}
        {lt_redirect && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/lt_redirect");
            }}
          >
            <div className="img-div">
              <img src={lt_redirect_img} alt="url redirect service" />
            </div>
            <div className="card-info">
              <h4>LT URL Redirect</h4>
            </div>
          </div>
        )}
        {bcMedia && (
          <div
            className="card"
            onClick={(e) => {
              navigate("/bc-media-tool");
            }}
          >
            <div className="img-div">
              <img src={basecamp_img} alt="url redirect service" />
            </div>
            <div className="card-info">
              <h4>BaseCamp Media Tool</h4>
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
