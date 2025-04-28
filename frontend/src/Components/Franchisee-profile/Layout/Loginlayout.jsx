import { useState, useEffect } from "react";
import "./Loginlayout.css";
import logo from "../../../assets/warrior img.png";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import axios from "axios"; 

const Loginlayout = () => {
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renewalDate, setRenewalDate] = useState(""); // ✅ Added
  const [logo, setLogo] = useState(null); // ✅ Add this line to define state for logo


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
    const fetchRenewalDate = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/franchisee/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.renewalDate) {
          const dateObj = new Date(data.renewalDate);
          const formattedDate = dateObj.toLocaleDateString("en-GB").replace(/\//g, "-"); // dd-mm-yyyy
          setRenewalDate(formattedDate);
        }
      } catch (err) {
        console.error("Error fetching renewal date:", err);
      }
    };

    fetchRenewalDate();
  }, []); // ✅ Added

  const navigate = useNavigate(); // ✅ NEW

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login"; // or use navigate("/login") if using useNavigate
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/settings`)
      .then((response) => {
        const data = response.data;
        console.log("Logo fetched:", data); // Debug log
        if (data.photo) {
          const logoUrl = `${import.meta.env.VITE_API_URL}/${data.photo}`;
          console.log("Logo URL:", logoUrl); // Debug log
          setLogo(logoUrl);
        } else {
          console.log("No logo found in the response.");
          setLogo(null); // Set to null if no logo is found
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  return (
    <>
      <div className={`top-line-2 ${visible ? "" : "hidden-nav-2"}`}></div>

      <div className={`logo-container-2 ${visible ? "" : "hidden-nav-2"}`}>
        <img
          src={logo || "https://via.placeholder.com/150"} // Fallback if no logo is fetched
          alt="Logo"
          className="logo-2"
          onError={(e) => { 
            e.target.src = "https://via.placeholder.com/150"; 
            console.log("Image load failed for:", e.target.src, "using fallback"); 
          }}
        />
      </div>

      {/* Desktop Navbar */}
      <nav className={`navbar-2 ${visible ? "" : "hidden-nav-2"}`}>
        <div className="nav-container-2">
          <ul className="nav-links-2">
            <li><a href="/" className="nav-link-2">HOME</a></li>
            <li><a href="#" className="nav-link-2">PROFILE</a></li>
            <li><a href="#" className="nav-link-2">COURSE FEE</a></li>
            <li><a href="#" className="nav-link-2">TRANSACTION LEDGERS</a></li>
            <li><a href="/agreement" className="nav-link-2">FRANCHASEE AGREEMENT</a></li>
            <li>
  <a href="#" onClick={handleLogout} className="nav-link-2">LOGOUT</a>
</li>
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
          <li>
  <a href="#" onClick={handleLogout}>LOGOUT</a>
</li>
        </ul>
      </div>

      {/* Contact Info */}
      <div className={`contact-info-1 ${visible ? "" : "hidden-nav-2"}`}>
        Renewal Date : {renewalDate || "Loading..."} {/* ✅ Updated this line */}
      </div>
    </>
  );
};

export default Loginlayout;
