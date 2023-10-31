import "./ToyotaMedia.css";
import FileDropComponent from "./components/FileDropComponent";
import { useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

function ToyotaMedia() {
  const [mediaBuyFile, setMediaBuyFile] = useState(null);
  const [modelRotFile, setModelRotFile] = useState(null);
  const [monthCode, setMonthCode] = useState("");
  const [yearCode, setYearCode] = useState("");

  const onMediaBuyFileUpload = (uploadedFile) => {
    setMediaBuyFile(uploadedFile);
  };

  const onModelRotFileUpload = (uploadedFile) => {
    setModelRotFile(uploadedFile);
  };

  const submitData = async () => {
    const data = new FormData();
    data.append("YC", yearCode);
    data.append("MC", monthCode);
    if (mediaBuyFile) {
      data.append("toyota_data", mediaBuyFile);
    } else {
      return 0;
    }
    if (modelRotFile) {
      data.append("coop_data", modelRotFile);
    } else {
      return 0;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/toyota_media_buy_processing",
        data
      );
      console.log("Data uploaded successfully:", response.data);
    } catch (error) {
      console.error("There was an error uploading the data:", error);
    }
  };

  return (
    <div className="toyota-main-content">
      <Navbar />
      <div className="spacer"></div>
      <div className="label-file-div">
        <label className="file-label">Toyota Media Buy File</label>
        <div className="toyota-file-drop">
          <FileDropComponent
            onFileUpload={onMediaBuyFileUpload}
            className="file-area"
          />
        </div>
      </div>
      <div className="label-file-div">
        <label className="file-label">Co-op Model Rotation File</label>
        <div className="toyota-file-drop">
          <FileDropComponent
            onFileUpload={onModelRotFileUpload}
            className="file-area"
          />
        </div>
      </div>
      <div className="date-selectors">
        <select
          onChange={(e) => {
            setMonthCode(e.target.value);
          }}
          name="MC"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <select
          onChange={(e) => {
            setYearCode(e.target.value);
          }}
          name="YC"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <button className="toyota-btn" onClick={submitData}>
        Process Data
      </button>
    </div>
  );
}

export default ToyotaMedia;
