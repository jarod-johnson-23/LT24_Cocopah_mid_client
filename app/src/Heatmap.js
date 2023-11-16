import "./Heatmap.css";
import InputSection from "./components/InputSection";
import { useState, useEffect } from "react";
import LTlogo from "./components/images/LT_logo.png";
import { useNavigate } from "react-router-dom";

function Heatmap() {
  const [apiData, setApiData] = useState("");
  const navigate = useNavigate();

  const handleApiData = (data) => {
    setApiData(data);
  };

  useEffect(() => {
    const currentHeatmapIframe = document.getElementById("current-heatmap");

    if (apiData != null && apiData != "") {
      currentHeatmapIframe.style.zIndex = 0;
      currentHeatmapIframe.src = apiData;
    } else {
      currentHeatmapIframe.zIndex = -2;
      currentHeatmapIframe.src = "";
    }
  }, [apiData]);

  return (
    <div style={{ position: "relative" }}>
      <InputSection onApiDataReceived={handleApiData} className="side-menu" />
      <div className="lt-logo-heatmap">
        <img
          src={LTlogo}
          alt="logo"
          onClick={(e) => {
            navigate("/dashboard");
          }}
        />
      </div>

      <iframe
        src="https://py.laneterraleverapi.org/heatmap/result/default.html"
        id="heatmap-iframe"
        width="100%"
      ></iframe>
      <iframe src="" id="current-heatmap" width="100%"></iframe>
    </div>
  );
}

export default Heatmap;
