import React, { useState, useEffect } from 'react';
import './footer.css'; // Make sure to style it properly
import axios from "axios";

const Footer = () => {
  const [footerData, setFooterData] = useState({
    footerLogo: null,
    email: "rcsasedu@gmail.com",
    phone1: "07122702727",
    phone2: "9422123456",
    socialLinks: [
      { url: "https://facebook.com", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png" },
      { url: "https://instagram.com", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" },
      { url: "https://linkedin.com", icon: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
    ],
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/settings`)
      .then((response) => {
        const data = response.data;
        console.log("Footer data fetched:", data); // Debug log
        setFooterData({
          footerLogo: data.footerLogo ? `${import.meta.env.VITE_API_URL}/${data.footerLogo}` : null,
          email: data.email || "rcsasedu@gmail.com",
          phone1: data.phone1 || "07122702727",
          phone2: data.phone2 || "9422123456",
          socialLinks: data.socialLinks.map((link) => ({
            url: link,
            icon: link.includes("facebook") ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png" :
                  link.includes("instagram") ? "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" :
                  link.includes("linkedin") ? "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" :
                  "https://via.placeholder.com/24", // Fallback icon
          })),
        });
      })
      .catch((error) => console.error("Error fetching footer data:", error));
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section - Logo */}
        <div className="footer-logo">
          <img src={footerData.footerLogo || "https://via.placeholder.com/100"} alt="RCSAS Education Logo" onError={(e) => { e.target.src = "https://via.placeholder.com/100"; console.log("Image load failed for:", e.target.src, "using fallback"); }} />
          <h4>WARRIOR EDUCATION</h4>
        </div>

        {/* Middle Section - Contact Details */}
        <div className="footer-contact">
          <p>
            <span>📧</span> <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
          </p>
          <p>
            <span>📞</span> {footerData.phone1}
          </p>
          <p>
            <span>📱</span> <a href={`tel:+${footerData.phone2}`}>{footerData.phone2}</a>
          </p>
        </div>

        {/* Right Section - Social Links */}
        <div className="footer-social">
          {footerData.socialLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
              <img src={link.icon} alt="Social Icon" width="24" />
            </a>
          ))}
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;