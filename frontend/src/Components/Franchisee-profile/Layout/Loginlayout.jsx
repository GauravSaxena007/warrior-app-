import { useState, useEffect } from "react";
import "./Loginlayout.css";
import logo from "../../../assets/warrior img.jpg";

const Loginlayout = () => {
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
      <div className={`top-line-2 ${visible ? "" : "hidden-nav-2"}`}></div>

      <div className={`logo-container-2 ${visible ? "" : "hidden-nav-2"}`}>
        <img src={logo} alt="Logo" className="logo-2" />
      </div>

      {/* Desktop Navbar */}
      <nav className={`navbar-2 ${visible ? "" : "hidden-nav-2"}`}>
        <div className="nav-container-2">
          <ul className="nav-links-2">
            <li><a href="/" className="nav-link-2">HOME</a></li>
            <li><a href="#" className="nav-link-2">PROFILE</a></li>
            <li><a href="#" className="nav-link-2">COURSE FEE</a></li>
            <li><a href="#" className="nav-link-2">TRANSACTION LEDGERS</a></li>
            <li><a href="#" className="nav-link-2">FRANCHASEE AGREEMENT</a></li>
            <li><a href="/contact" className="nav-link-2">LOGOUT</a></li>
          </ul>
        </div>
      </nav>

      {/* Hamburger Button */}
      <button className="hamburger-2" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu-2 ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links-2">
          <li><a href="/">HOME</a></li>
          <li><a href="#">PROFILE</a></li>
          <li><a href="#">COURSE FEE</a></li>
          <li><a href="#">TRANSACTION LEDGERS</a></li>
          <li><a href="#">FRANCHASEE AGREEMENT</a></li>
          <li><a href="/contact">LOGOUT</a></li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className={`contact-info-1 ${visible ? "" : "hidden-nav-2"}`}>
        Renewal Date : 04-03-2025
      </div>
    </>
  );
};

export default Loginlayout;
