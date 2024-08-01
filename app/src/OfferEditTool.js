import "OfferEditTool.css";
import axios from "axios";
import { API_BASE_URL } from "./config";
import FileDropComponent from "./components/FileDropComponent";
import Navbar from "./components/Navbar";
import { useState } from "react";

function OfferEditTool() {
  const [offerFile, setOfferFile] = useState(null);

  const onOfferFileUpload = (extractedColumns, uploadedFile) => {
    setOfferFile(uploadedFile);
  };

  const submitFiles = async () => {
    try {
      const formData = new FormData();
      if (offerFile) formData.append('file', offerFile);
  
      // Make the API request to send the data
      const response = await axios.post(`${API_BASE_URL}/offer-edit-tool`, formData, {
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
          onFileUpload={onOfferFileUpload}
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

export default OfferEditTool;
