import { useState, useEffect } from "react";
import "./Loginlayout.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Loginlayout = ({ children, topupAmount: externalTopupAmount, setTopupAmount: setExternalTopupAmount }) => {
  const [scrollPos, setScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renewalDate, setRenewalDate] = useState("");
  const [logo, setLogo] = useState(null);
  const [topupAmount, setTopupAmount] = useState(externalTopupAmount || 0);
  const navigate = useNavigate();

  const fetchTopup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, redirecting to login");
        navigate("/login");
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/franchisee/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const amount = data.topupAmount || 0;
      setTopupAmount(amount);
      if (setExternalTopupAmount) {
        setExternalTopupAmount(amount); // Update parent state if provided
      }
      localStorage.setItem("topupAmount", amount);
    } catch (err) {
      console.error("Failed to fetch balance:", err.message);
    }
  };

  useEffect(() => {
    fetchTopup();
    window.addEventListener("topupChanged", fetchTopup);
    return () => window.removeEventListener("topupChanged", fetchTopup);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(currentScrollPos < 10); // Increased threshold for visibility
      setScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchRenewalDate = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, redirecting to login");
          navigate("/login");
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/franchisee/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.renewalDate) {
          const dateObj = new Date(data.renewalDate);
          if (!isNaN(dateObj)) {
            const formattedDate = dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
            setRenewalDate(formattedDate);
          } else {
            console.warn("Invalid renewal date:", data.renewalDate);
            setRenewalDate("N/A");
          }
        }
      } catch (err) {
        console.error("Error fetching renewal date:", err.message);
        setRenewalDate("N/A");
      }
    };

    fetchRenewalDate();
  }, [navigate]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/settings`)
      .then((response) => {
        const data = response.data;
        if (data?.photo) {
          const logoUrl = `${import.meta.env.VITE_API_URL}/${data.photo}`;
          setLogo(logoUrl);
        } else {
          setLogo(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching logo:", error.message);
        setLogo(null);
      });
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="login-layout-container">
      <div className={`top-line-2 ${visible ? "" : "hidden-nav-2"}`}></div>
      <div className={`logo-container-2 ${visible ? "" : "hidden-nav-2"}`}>
        <img
          src={logo || "https://via.placeholder.com/150"}
          alt="Logo"
          className="logo-2"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
            console.log("Image load failed, using fallback");
          }}
        />
      </div>
      <nav className={`navbar-2 ${visible ? "" : "hidden-nav-2"}`}>
        <div className="nav-container-2">
          <ul className="nav-links-2">
            <li><a href="/" className="nav-link-2">HOME</a></li>
            <li><a href="/error" className="nav-link-2">PROFILE</a></li>
            <li><a href="/error" className="nav-link-2">COURSE FEE</a></li>
            <li><a href="/error" className="nav-link-2">TRANSACTION LEDGERS</a></li>
            <li><a href="/agreement" className="nav-link-2">FRANCHISEE AGREEMENT</a></li>
            <li><a href="#" onClick={handleLogout} className="nav-link-2">LOGOUT</a></li>
          </ul>
        </div>
      </nav>
      <button
        className="hamburger-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <div className={`mobile-menu-2 ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links-2">
          <li><a href="/">HOME</a></li>
          <li><a href="/error">PROFILE</a></li>
          <li><a href="/error">COURSE FEE</a></li>
          <li><a href="/error">TRANSACTION LEDGERS</a></li>
          <li><a href="/agreement">FRANCHISEE AGREEMENT</a></li>
          <li><a href="#" onClick={handleLogout}>LOGOUT</a></li>
        </ul>
      </div>
      <div className={`contact-info-1 ${visible ? "" : "hidden-nav-2"}`}>
        Renewal Date: {renewalDate || "Loading..."}
      </div>
      <div
        className={`contact-info-7 ${visible ? "" : "hidden-nav-2"}`}
        
      >
        💰 Top-Up Balance : ₹{topupAmount}
      </div>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Loginlayout;