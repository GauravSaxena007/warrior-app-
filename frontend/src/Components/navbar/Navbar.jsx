import { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/warrior img.jpg";
import Dropdowncourses from "../dropdown-courses-menus/dropdowncourses";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos < 10); // Show only when at the top
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
      <nav className={`navbar ${visible ? "" : "hidden-nav"}`}>
        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="/">HOME</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li className="dropdown"><Dropdowncourses /></li>
            <li><a href="#">ONLINE EXAM</a></li>
            <li><a href="#">ONLINE REGISTRATION</a></li>
            <li><a href="#">CERTIFICATE VERIFY</a></li>
            <li><a href="/contact">CONTACT US</a></li>
            <li><a href="#"><Profile /></a></li>
          </ul>
        </div>
      </nav>
      <div className={`contact-info-1 ${visible ? "" : "hidden-nav"}`}>
        Franchisee Enquiry : 📞 9422123456
      </div>
    </>
  );
};

export default Navbar;
