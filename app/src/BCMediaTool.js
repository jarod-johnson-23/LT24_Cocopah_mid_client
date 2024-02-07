import "./BCMediaTool.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import { API_BASE_URL } from "./config";

function BCMediaTool() {
  const update_sheets = async () => {
    var selectedValue = document.getElementById("bc-select").value;

    // Replace 'specificValue' with the value you want to check against
    if (selectedValue !== "null") {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/basecamp/update_sheet`
        );
      } catch (error) {}
      return;
    } else {
      alert("Please select a campaign");
      return;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bc-main-content">
        <div className="bc-input">
          <label className="bc-label">Step 1:</label>
          <select className="styled-select" id="bc-select">
            <option value="null">Select Campaign</option>
            <option value="UC">UC</option>
            <option value="K2K">K2K</option>
          </select>
        </div>
        <div className="bc-input">
          <label className="bc-label">Step 2:</label>
          <button className="submit-btn" onClick={update_sheets}>
            Update Sheets
          </button>
        </div>
      </div>
    </div>
  );
}

export default BCMediaTool;
