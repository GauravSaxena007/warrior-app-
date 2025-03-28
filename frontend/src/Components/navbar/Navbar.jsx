import { useState } from "react";
import "./Navbar.css"; // Import external CSS
import logo from "../../assets/warrior img.jpg";  // Correct way to import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top orange line */}
      <div className="top-line"></div>

      {/* Logo - Completely outside the navbar */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="#">HOME</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li className="dropdown">
              <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
                COURSES &#9662;
              </button>
              {isOpen && (
                <ul className="dropdown-menu">
                  <li><a href="#">Course 1</a></li>
                  <li><a href="#">Course 2</a></li>
                </ul>
              )}
            </li>
            <li><a href="#">ONLINE EXAM</a></li>
            <li><a href="#">ONLINE REGISTRATION</a></li>
            <li><a href="#">CERTIFICATE VERIFY</a></li>
            <li><a href="#">CONTACT US</a></li>
            <li><a href="#">LOGIN</a></li>
          </ul>
        </div>
        <div className="contact-box">
          <span className="phone-icon">📞</span> 9422123456
        </div>
      </nav>
    </>
  );
};

export default Navbar;
