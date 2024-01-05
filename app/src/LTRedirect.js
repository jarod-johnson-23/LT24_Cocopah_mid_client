import "./LTRedirect.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

function LTRedirect() {
  const [subdomain, setSubdomain] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const domain = isProfessional ? ".lt.agency" : ".laneterraleverapi.org";
  let navigate = useNavigate();

  const validateSubdomain = (subdomain) => {
    // Here you can add subdomain-specific validation as per your requirements.
    const subdomainRegex = /^(?!-)(?!.*--)[A-Za-z0-9-]{1,63}(?<!-)$/;
    return subdomainRegex.test(subdomain);
  };

  const validateRedirectUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false; // If creating the URL fails, it's an invalid URL
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!validateSubdomain(subdomain)) {
      alert("Invalid subdomain. Please enter a valid subdomain.");
      return;
    }

    if (!validateRedirectUrl(redirectUrl)) {
      alert("Invalid redirect URL. Please enter a valid URL.");
      return;
    }
    // Perform the request to create the subdomain...
    fetch(`${API_BASE_URL}/add_subdomain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        subdomain_name: subdomain,
        domain_name: isProfessional,
        redirect_link: redirectUrl,
        email: email,
      }),
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => {
        console.log(data);
        // Handle success response (maybe show a success message to the user)
      })
      .catch((error) => {
        console.error("Error creating subdomain:", error.message);
        // Handle API errors (maybe show an error message to the user)
      });
  };

  const toggleUseType = () => {
    setIsProfessional(!isProfessional);
    // Here you can handle additional state updates or API calls based on the toggle
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_BASE_URL}/protected`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setEmail(data.logged_in_as);
        } else {
          // If the token is not valid, remove it from localStorage
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error validating token", error);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <div className="lt-redirect-page">
      <Navbar />
      <div className="redirect-form-container">
        <form onSubmit={handleSubmit} className="redirect-form">
          <div className="toggle-container" onClick={toggleUseType}>
            <div
              className={`slider ${isProfessional ? "right" : "left"}`}
            ></div>
            <div
              className={`toggle-text left-text ${
                isProfessional ? "faded" : ""
              }`}
            >
              Personal Use
            </div>
            <div
              className={`toggle-text right-text ${
                isProfessional ? "" : "faded"
              }`}
            >
              Professional Use
            </div>
          </div>
          <label className="redirect-label">This URL...</label>
          <div className="redirect-input-class">
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              required
              className="small-text-box lowercase"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="none"
            />
            <span className="static-text">{domain}</span>
          </div>
          <label className="redirect-label">...redirects to:</label>
          <div className="redirect-input-class" id="wide-input">
            <input
              type="text"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              required
              className="wide-text-box"
              autoCorrect="off"
              spellCheck="false"
              autoCapitalize="none"
            />
          </div>
          <button type="submit" className="redirect-btn">
            Request Redirect
          </button>
        </form>
      </div>
    </div>
  );
}

export default LTRedirect;
