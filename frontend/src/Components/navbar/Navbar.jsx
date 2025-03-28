import { useState } from "react";
import "./Navbar.css"; // Import external CSS
import logo from "../../assets/warrior img.jpg";  // Correct way to import
import Dropdowncourses from "../dropdown-courses-menus/dropdowncourses";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top orange line */}
      <div className="top-line"></div>

      {/* Logo - Positioned outside the navbar */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="/">HOME</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li className="dropdown">
          <Dropdowncourses/>
        </li>
            <li><a href="#">ONLINE EXAM</a></li>
            <li><a href="#">ONLINE REGISTRATION</a></li>
            <li><a href="#">CERTIFICATE VERIFY</a></li>
            <li><a href="#">CONTACT US</a></li>
            <li><a href="#">LOGIN</a></li>
          </ul>
        </div>
      </nav>

      {/* Contact Number - Placed Outside Navbar */}
      <div className="contact-info">
        Franchisee Enquiery : 📞 9422123456
      </div>
    </>
  );
};

export default Navbar;
