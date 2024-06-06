import "./SowUpload.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "./config";
import FileDropComponent from "./components/FileDropComponent";

const submitGoogleDoc = () => {
  return;
};

const submitGoogleDrive = () => {
  return;
};

function SowUpload() {
  const [docUrl, setDocUrl] = useState("");
  const [driveUrl, setDriveUrl] = useState("");

  return (
    <>
      <Navbar />
      <div className="sow-page">
        <div className="sow-upload-content sow-main-content">
          <h3 className="sow-upload-title">File Upload</h3>
          <FileDropComponent />
          <button className="sow-btn">Submit File</button>
        </div>
        <div className="sow-docs-content sow-main-content">
          <h3 className="sow-upload-title">Google Doc Upload</h3>
          <div className="input-label-combo-wombo">
            <label>URL:</label>
            <input
              type="text"
              className="sow-url-input"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="none"
              value={docUrl}
              onChange={(e) => {
                setDocUrl(e.target.value);
              }}
            />
          </div>
          <button
            className="sow-btn"
            onClick={(e) => {
              submitGoogleDoc();
            }}
          >
            Submit Doc URL
          </button>
        </div>
        <div className="sow-drive-content sow-main-content">
          <h3 className="sow-upload-title">Google Drive Upload</h3>
          <div className="input-label-combo-wombo">
            <label>URL:</label>
            <input
              type="text"
              className="sow-url-input"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="none"
              value={driveUrl}
              onChange={(e) => {
                setDriveUrl(e.target.value);
              }}
            />
          </div>
          <button
            className="sow-btn"
            onClick={(e) => {
              submitGoogleDrive();
            }}
          >
            Submit Drive URL
          </button>
        </div>
      </div>
    </>
  );
}

export default SowUpload;
