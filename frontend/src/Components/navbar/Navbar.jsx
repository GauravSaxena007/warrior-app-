import { useState, useEffect } from "react";
import "./Navbar.css";
import axios from "axios";
import Dropdowncourses from "../Courses/Dropdowncourses";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [franchiseNumber, setFranchiseNumber] = useState("9422123456");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos < 10);
      setScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/settings`)
      .then((response) => {
        const data = response.data;
        console.log("Navbar data fetched:", data); // Debug log
        setFranchiseNumber(data.franchiseNumber || "9422123456");
        setPhoto(data.photo ? `${import.meta.env.VITE_API_URL}/${data.photo}` : null);
      })
      .catch((error) => console.error("Error fetching navbar data:", error));
  }, []);
  

  return (
    <>
      <div className={`top-line ${visible ? "" : "hidden-nav"}`}></div>
      <div className={`logo-container ${visible ? "" : "hidden-nav"}`}>
        <img src={photo || "https://via.placeholder.com/50"} alt="Logo" className="logo" onError={(e) => { e.target.src = "https://via.placeholder.com/50"; console.log("Image load failed for:", e.target.src, "using fallback"); }} />
      </div>

      {/* Desktop Navbar */}
      <nav className={`navbar ${visible ? "" : "hidden-nav"}`}>
        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="/">HOME</a></li>
            <li><a href="/error">ABOUT US</a></li>
            <li className="dropdown"><Dropdowncourses /></li>
            <li><a href="/error">ONLINE EXAM</a></li>
            <li><a href="/error">ONLINE REGISTRATION</a></li>
            <li><a href="/verify">CERTIFICATE VERIFY</a></li>
            <li><a href="/contact">CONTACT US</a></li>
            <li><a href=""><Profile /></a></li>
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
          <li><a href="/error">ABOUT US</a></li>
          <li className="dropdown"><Dropdowncourses /></li>
          <li><a href="/error">ONLINE EXAM</a></li>
          <li><a href="/error">ONLINE REGISTRATION</a></li>
          <li><a href="/verify">CERTIFICATE VERIFY</a></li>
          <li><a href="/contact">CONTACT US</a></li>
          <li><a href=""><Profile /></a></li>
        </ul>
      </div>

      <div className={`contact-info-1 ${visible ? "" : "hidden-nav"}`}>
        Franchisee Enquiry : 📞 {franchiseNumber}
      </div>
    </>
  );
};

export default Navbar;