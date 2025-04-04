import { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/warrior img.jpg";
import Dropdowncourses from "../dropdown-courses-menus/dropdowncourses";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos < 10);
      setScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`top-line ${visible ? "" : "hidden-nav"}`}></div>
      <div className={`logo-container ${visible ? "" : "hidden-nav"}`}>
        <img src={logo} alt="Logo" className="logo" />
      </div>

      {/* Desktop Navbar */}
      <nav className={`navbar ${visible ? "" : "hidden-nav"}`}>
        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="/">HOME</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li className="dropdown"><Dropdowncourses /></li>
            <li><a href="#">ONLINE EXAM</a></li>
            <li><a href="#">ONLINE REGISTRATION</a></li>
            <li><a href="/verify">CERTIFICATE VERIFY</a></li>
            <li><a href="/contact">CONTACT US</a></li>
            <li><a href="#"><Profile /></a></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Hamburger Menu */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links">
          <li><a href="/">HOME</a></li>
          <li><a href="#">ABOUT US</a></li>
          <li><a href="#">ONLINE EXAM</a></li>
          <li><a href="#">ONLINE REGISTRATION</a></li>
          <li><a href="/verify">CERTIFICATE VERIFY</a></li>
          <li><a href="/contact">CONTACT US</a></li>
          <li><a href="#"><Profile /></a></li>
        </ul>
      </div>

      <div className={`contact-info-1 ${visible ? "" : "hidden-nav"}`}>
        Franchisee Enquiry : 📞 9422123456
      </div>
    </>
  );
};

export default Navbar;
