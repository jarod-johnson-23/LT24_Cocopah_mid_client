import "./FileUpload.css";
import axios from "axios";
import { API_BASE_URL } from "./config";
import FileDropComponent from "./components/FileDropComponent";
import Navbar from "./components/Navbar";
import { useState } from "react";

function FileUpload() {
  const [portalFile, setPortalFile] = useState(null);

  const onPortalFileUpload = (extractedColumns, uploadedFile) => {
    setPortalFile(uploadedFile);
  };

  const submitFiles = async () => {
    try {
      const formData = new FormData();
      if (portalFile) formData.append('file', portalFile);
  
      // Make the API request to send the data
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // Handle the response as needed
      console.log('File upload successful:', response.data);
      alert('File Uploaded Successfully');
    } catch (error) {
      console.error('Error: ', error);
      alert('Error generating mailing list. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="file-upload-main">
        <FileDropComponent
          onFileUpload={onPortalFileUpload}
          className="file-area"
        />
        <div className="file-button-combo">
        <button onClick={(e) => {
          submitFiles();
        }}>Submit File</button></div>
      </div>
    </>
  );
}

export default FileUpload;
