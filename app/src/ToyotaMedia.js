import "./ToyotaMedia.css";
import FileDropComponent from "./components/FileDropComponent";
import { useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

function ToyotaMedia() {
  const [mediaBuyFile, setMediaBuyFile] = useState(null);
  const [modelRotFile, setModelRotFile] = useState(null);
  const [monthCode, setMonthCode] = useState("1");
  const [yearCode, setYearCode] = useState("2023");

  const onMediaBuyFileUpload = (extractedColumns, uploadedFile) => {
    setMediaBuyFile(uploadedFile);
  };

  const onModelRotFileUpload = (extractedColumns, uploadedFile) => {
    setModelRotFile(uploadedFile);
  };

  const submitData = async () => {
    const data = new FormData();
    data.append("YC", yearCode);
    data.append("MC", monthCode);
    if (mediaBuyFile) {
      data.append("toyota_file", mediaBuyFile);
    } else {
      return 0;
    }
    if (modelRotFile) {
      data.append("coop_file", modelRotFile);
    } else {
      return 0;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/toyota_media_buy_processing",
        data,
        { responseType: "blob" }
      );
      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Build a URL from the file
      const fileURL = URL.createObjectURL(file);

      // Create a link element
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `Toyota E Submission - Final - ${monthCode}_${yearCode}.xlsx`; // The file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("File Downloaded Successfully");
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
          <option value="01">1</option>
          <option value="02">2</option>
          <option value="03">3</option>
          <option value="04">4</option>
          <option value="05">5</option>
          <option value="06">6</option>
          <option value="07">7</option>
          <option value="08">8</option>
          <option value="09">9</option>
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
