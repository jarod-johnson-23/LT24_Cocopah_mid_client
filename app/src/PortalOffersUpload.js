import "./PortalOffersUpload.css";
import axios from "axios";
import { API_BASE_URL } from "./config";
import FileDropComponent from "./components/FileDropComponent";
import Navbar from "./components/Navbar";
import { useState } from "react";

function PortalOffersUpload() {
  const [file, setFile] = useState(null);
  const [value, setValue] = useState("FUTURE");

  const onFileUpload = (extractedColumns, uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("value", value);

    try {
      const response = await axios.post(`${API_BASE_URL}/query_wp_posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="portal-upload-main">
        <FileDropComponent onFileUpload={onFileUpload} className="file-area" />
        <div className="radio-buttons">
          <label>
            <input
              type="radio"
              name="value"
              value="PAST"
              checked={value === "PAST"}
              onChange={(e) => setValue(e.target.value)}
            />
            Past
          </label>
          <label>
            <input
              type="radio"
              name="value"
              value="PRESENT"
              checked={value === "PRESENT"}
              onChange={(e) => setValue(e.target.value)}
            />
            Present
          </label>
          <label>
            <input
              type="radio"
              name="value"
              value="FUTURE"
              checked={value === "FUTURE"}
              onChange={(e) => setValue(e.target.value)}
            />
            Future
          </label>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}

export default PortalOffersUpload;