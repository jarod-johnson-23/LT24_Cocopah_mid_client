import "./Navbar.css";
import logo from "./images/cocopah_img.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Navbar() {
  const token = localStorage.getItem("token");
  let isLoggedIn = token !== null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const user = localStorage.getItem("token");
    if (user) {
      isLoggedIn = user;
    }
  }, [token]);

  return (
    <div className="navbar">
      <img
        src={logo}
        className="logo"
        alt="logo"
        onClick={(e) => {
          if (isLoggedIn) {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }}
      />
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      )}
    </div>
  );
}

export default Navbar;
