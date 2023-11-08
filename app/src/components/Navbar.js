import "./Navbar.css";
import logo from "./images/LT_logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    navigate("/");
  };

  return (
    <div className="navbar">
      <img src={logo} className="logo" />
      {isLoggedIn && (
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      )}
    </div>
  );
}

export default Navbar;
