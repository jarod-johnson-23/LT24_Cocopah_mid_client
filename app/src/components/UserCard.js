// UserCard.js
import "./UserCard.css";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./../config";

function UserCard({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localAccessRights, setLocalAccessRights] = useState(user.access || {});
  const setupClass = user.setupComplete ? "setup-complete" : "setup-incomplete";
  const isAdmin = user.access && user.access.admin;
  const hasName = user.firstName || user.lastName;
  const cardClasses = `user-card ${isExpanded ? "expanded" : ""}`;

  const handleCardClick = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  const handleLocalCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setLocalAccessRights((prevState) => {
      const newState = { ...prevState };
      newState[name] = checked;
      return newState;
    });
  };

  // Values for checkboxes; assuming these don't change and could be moved outside the component
  const checkboxes = [
    { label: "Zipcode Heatmap", value: "heatmap" },
    { label: "Toyota Media Buy", value: "toyota" },
    { label: "Admin Tool Access", value: "admin" },
    { label: "Beau Joke", value: "beau" },
    { label: "Check-in Question Generator", value: "wsQuestion" },
  ];

  const handleUpdateAccess = async () => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/${user._id}/update-access`,
        {
          access: localAccessRights,
        }
      );

      if (response.status === 200) {
        alert("Access rights updated successfully.");
      } else {
        // Handle other successful responses, if any (e.g., 201 Created)
      }
    } catch (error) {
      console.error("Error updating access rights:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${user._id}/delete`);
        // Trigger a custom event with the user ID to inform the parent component (AdminPage)
        window.dispatchEvent(
          new CustomEvent("userDeleted", { detail: user._id })
        );
      } catch (error) {
        console.error("Error deleting user account:", error);
        // Handle error (e.g., display an error message)
      }
    }
  };

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      <div className="whole-user-info-section">
        <div className="invis-placeholder"></div>
        <div className="user-card-top-section">
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            fill="#141a2d"
            stroke="#141a2d"
            strokeWidth="0.00018"
            transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"
            className="icon-svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="#CCCCCC"
              strokeWidth="0.036"
            />

            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fill="#141a2d"
                d="M9 0a9 9 0 0 0-9 9 8.654 8.654 0 0 0 .05.92 9 9 0 0 0 17.9 0A8.654 8.654 0 0 0 18 9a9 9 0 0 0-9-9zm5.42 13.42c-.01 0-.06.08-.07.08a6.975 6.975 0 0 1-10.7 0c-.01 0-.06-.08-.07-.08a.512.512 0 0 1-.09-.27.522.522 0 0 1 .34-.48c.74-.25 1.45-.49 1.65-.54a.16.16 0 0 1 .03-.13.49.49 0 0 1 .43-.36l1.27-.1a2.077 2.077 0 0 0-.19-.79v-.01a2.814 2.814 0 0 0-.45-.78 3.83 3.83 0 0 1-.79-2.38A3.38 3.38 0 0 1 8.88 4h.24a3.38 3.38 0 0 1 3.1 3.58 3.83 3.83 0 0 1-.79 2.38 2.814 2.814 0 0 0-.45.78v.01a2.077 2.077 0 0 0-.19.79l1.27.1a.49.49 0 0 1 .43.36.16.16 0 0 1 .03.13c.2.05.91.29 1.65.54a.49.49 0 0 1 .25.75z"
              />{" "}
            </g>
          </svg>
          <div className="user-info-section">
            {/* Conditionally render the full name or the email as the main title */}
            <h3>
              {hasName
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : user.email}
            </h3>
            {/* Render email below the name if either first or last name exist */}
            {hasName && <h5>{user.email}</h5>}
            <p>{user.role}</p>
          </div>
        </div>
        <div className="user-card-bottom-section">
          <div className="user-additional-info">
            {/* Render additional information here */}
            <div className="user-card-expanded-content">
              <div className="checkbox-group">
                {checkboxes.map((checkbox) => (
                  <div key={checkbox.value} className="custom-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id={`checkbox_${user._id}_${checkbox.value}`}
                      name={checkbox.value}
                      onChange={handleLocalCheckboxChange}
                      checked={localAccessRights[checkbox.value] === true}
                    />
                    <label
                      htmlFor={`checkbox_${user._id}_${checkbox.value}`}
                      className="custom-checkbox"
                    ></label>
                    <label
                      htmlFor={`checkbox_${user._id}_${checkbox.value}`}
                      style={{ position: "relative", top: "-4.75px" }}
                    >
                      {checkbox.label}
                    </label>
                  </div>
                ))}
              </div>
              <button onClick={handleUpdateAccess} className="update-btn">
                Update Access
              </button>
            </div>
            <button onClick={handleDeleteUser} className="delete-user-btn">
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <div className="status-boxes">
        <div className={`setup-status ${setupClass}`}>
          Account {user.setupComplete ? "Complete" : "Incomplete"}
        </div>
        {isAdmin ? (
          <div className="admin-access">Admin Access</div>
        ) : (
          <div className="admin-access-placeholder"></div>
        )}
      </div>
    </div>
  );
}

export default UserCard;
