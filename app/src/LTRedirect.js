import "./LTRedirect.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";
import trash_svg from "./components/images/trash.svg";

function LTRedirect() {
  const [subdomain, setSubdomain] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [email, setEmail] = useState("");
  const [subdomainsList, setSubdomainsList] = useState([]);
  const [duplicateSubdomain, setDuplicateSubdomain] = useState(false);
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

    if (duplicateSubdomain) {
      alert("This subdomain is already taken. Please choose another value.");
      return;
    }
    // Perform the request to create the subdomain...
    fetch(`${API_BASE_URL}/subdomain/add_subdomain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        // Corrected to stringify the object
        subdomain_name: subdomain,
        redirect_link: redirectUrl,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Add the new subdomain to the state
        let new_subdomain = {
          subdomain: subdomain,
          redirect_url: redirectUrl,
          is_activte: false,
        };
        setSubdomainsList((prevList) => [...prevList, new_subdomain]);

        // Clear input fields
        setSubdomain("");
        setRedirectUrl("");
      })
      .catch((error) => {
        console.error("Error creating subdomain:", error.status);
      });
  };

  const delete_subdomain = (subdomainName, redirect) => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/subdomain/delete_subdomain`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        subdomain_name: subdomainName,
        redirect_url: redirect,
        email: email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        // Remove subdomain from the state
        setSubdomainsList((prevList) =>
          prevList.filter((sub) => sub.subdomain !== subdomainName)
        );
      })
      .catch((error) => {
        console.error("Error deleting subdomain:", error.message);
      });
  };

  async function setAndCheckSubdomain(subdomainToCheck) {
    setSubdomain(subdomainToCheck);
    try {
      const token = localStorage.getItem("token");
      // Make a GET request to fetch all subdomains
      const response = await fetch(
        `${API_BASE_URL}/subdomain/get_all_subdomains`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // If a JWT token is needed
          },
          credentials: "include",
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response data
      const data = await response.json();
      const { subdomains } = data;

      // Check if the provided subdomain exists in the list
      const isDuplicate = subdomains.some(
        (sub) => sub.subdomain === subdomainToCheck
      );

      if (isDuplicate) {
        setDuplicateSubdomain(true);
      } else {
        setDuplicateSubdomain(false);
      }
    } catch (error) {
      console.error("Error fetching subdomains:", error.message);
      return false; // Return false if there is an error, assuming it's not unique
    }
  }

  useEffect(() => {
    const validateTokenAndFetchSubdomains = async () => {
      const token = localStorage.getItem("token");

      try {
        // Validate Token
        const authResponse = await fetch(`${API_BASE_URL}/users/protected`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (authResponse.ok) {
          const data = await authResponse.json();
          setEmail(data.logged_in_as);

          // Fetch Subdomains once the email is set
          const subdomainsResponse = await fetch(
            `${API_BASE_URL}/subdomain/get_subdomains_by_email?email=${data.logged_in_as}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );
          const subdomainsData = await subdomainsResponse.json();
          if (subdomainsResponse.ok) {
            setSubdomainsList(subdomainsData.subdomains); // Store subdomains
          } else {
            console.error("Failed to fetch subdomains:", subdomainsData.error);
            // Optionally handle errors or empty states
          }
        } else {
          // If the token is not valid, remove it from localStorage
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error validating token or fetching subdomains", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    validateTokenAndFetchSubdomains();
  }, [navigate]); // Ensures this only reruns when navigate changes

  return (
    <div className="lt-redirect-page">
      <Navbar />
      <div className="lt-redirect-page-content">
        <div className="redirect-form-container">
          <form onSubmit={handleSubmit} className="redirect-form">
            {/* <div className="toggle-container" onClick={toggleUseType}>
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
          </div> */}
            <label className="redirect-label">This URL...</label>
            <div className="redirect-input-class">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setAndCheckSubdomain(e.target.value)}
                required
                id="small-text-box"
                className="small-text-box lowercase"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="none"
              />
              <span className="static-text">.lt.agency</span>
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
            {duplicateSubdomain ? (
              <div className="duplicate-warning">
                <h3>Duplicate Subdomain</h3>
              </div>
            ) : (
              <></>
            )}
            <button
              type="submit"
              className="redirect-btn"
              id={`${duplicateSubdomain ? "subdomain-btn-disabled" : ""}`}
            >
              Request Redirect
            </button>
          </form>
        </div>
        <div className="subdomain-cards">
          <h2 className="subdomain-list-header">Owned Subdomains</h2>
          {subdomainsList.length > 0 ? (
            subdomainsList.map((subdomain) => (
              <div key={subdomain.subdomain} className="subdomain-card">
                <div className="subdomain-card-left">
                  <h2>{subdomain.subdomain}.lt.agency</h2>
                  <p>
                    Redirects to:{" "}
                    <a
                      href={subdomain.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {subdomain.redirect_url}
                    </a>
                  </p>
                  {subdomain.is_active ? (
                    <div className="subdomain-active">Active</div>
                  ) : (
                    <div className="subdomain-inactive">Inactive</div>
                  )}
                </div>
                <div
                  className="subdomain-card-right"
                  onClick={() => {
                    delete_subdomain(
                      subdomain.subdomain,
                      subdomain.redirect_url
                    );
                  }}
                >
                  <img src={trash_svg} />
                </div>
              </div>
            ))
          ) : (
            <h5>You do not currently own any subdomains, please fill out a request to secure your subdomains</h5>
          )}
        </div>
      </div>
    </div>
  );
}

export default LTRedirect;
