import "./Homepage.css";
import Navbar from "./components/Navbar";
import zip_heatmap_img from "./components/images/zipcode_heatmap_img.png";
import toyota_img from "./components/images/toyota.jpeg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    let access_json;
    try {
      const access = localStorage.getItem("access");
      access_json = access ? JSON.parse(access) : null;
    } catch (error) {
      console.log("Parsing error:", error);
      access_json = null;
    }

    console.log(access_json);
  }, []);

  return (
    <div className="homepage-content">
      <Navbar />
      <div className="box-section">
        <div
          className="card"
          onClick={(e) => {
            navigate("/zipcode_heatmap");
          }}
        >
          <div className="img-div">
            <img src={zip_heatmap_img} />
          </div>
          <div className="card-info">
            <h4>Heatmap Generator</h4>
          </div>
        </div>
        <div
          className="card"
          onClick={(e) => {
            navigate("/toyota_media_buy_processing");
          }}
        >
          <div className="img-div">
            <img src={toyota_img} />
          </div>
          <div className="card-info">
            <h4>Toyota Media Buy Processing</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
