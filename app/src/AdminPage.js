import "./AdminPage.css";
import Navbar from "./components/Navbar";
import { useState } from "react";
import axios from "axios";

function AdminPage() {
  const [accessRights, setAccessRights] = useState({});
  const [email, setEmail] = useState(""); // New state for the email

  // Values for checkboxes
  const checkboxes = [
    { label: "Zipcode Heatmap", value: "heatmap" },
    { label: "Toyota Media Buy", value: "toyota" },
    { label: "Admin Tool Access", value: "admin" },
  ];

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setAccessRights((prevState) => {
      // If the checkbox is checked, add the access right with value true
      // Otherwise, remove the access right from the object
      const newState = { ...prevState };
      if (checked) {
        newState[name] = true;
      } else {
        delete newState[name];
      }
      return newState;
    });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Update the email state when text is typed
  };

  const handleSendEmail = async () => {
    if (!email || Object.keys(accessRights).length === 0) {
      alert("Please enter an email and select at least one access right.");
      return;
    }

    const data = {
      email: email,
      accessRights: accessRights,
    };

    try {
      // Send a POST request to the /admin/create-user route
      const response = await axios.post(
        "http://localhost:5000/admin/create-user",
        data
      );

      if (response.status === 201) {
        alert(
          "Account creation initiated. A setup email has been sent to the user."
        );
      } else {
        // Handle other successful responses, if any (e.g., 200 OK)
      }
    } catch (error) {
      if (error.response) {
        // Handle the response error given by the server (e.g., 400 or 409)
        alert(
          `Failed to initiate account creation: ${error.response.data.error}`
        );
      } else {
        // Handle connection errors, timeouts, etc.
        alert("Network or server error. Please try again.");
      }
    }
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-content">
        <div className="admin-account-section">
          <h1>Account Section</h1>
        </div>
        <div className="vert-line"></div>
        <div className="admin-create-account-section">
          <h2>Create Account</h2>
          <div className="checkbox-group">
            {checkboxes.map((checkbox) => (
              <div key={checkbox.value} className="custom-checkbox-wrapper">
                <input
                  type="checkbox"
                  id={`checkbox_${checkbox.value}`}
                  name={checkbox.value}
                  onChange={handleCheckboxChange}
                  checked={accessRights[checkbox.value] === true}
                />
                <label
                  htmlFor={`checkbox_${checkbox.value}`}
                  className="custom-checkbox"
                ></label>
                <label
                  htmlFor={`checkbox_${checkbox.value}`}
                  style={{ position: "relative", top: "-4.75px" }}
                >
                  {checkbox.label}
                </label>
              </div>
            ))}
          </div>
          <div className="text-input-class">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <button onClick={handleSendEmail} className="create-btn">
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
