import "./Navbar.css";
import logo from "./images/LT_logo.png";

function Navbar() {
  return (
    <div className="navbar">
      <img src={logo} className="logo" />
    </div>
  );
}

export default Navbar;
