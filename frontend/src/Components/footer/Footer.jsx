import React from 'react';
import './footer.css'; // Make sure to style it properly
import logo from "../../assets/warrior img.jpg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section - Logo */}
        <div className="footer-logo">
          <img src={logo} alt="RCSAS Education Logo" />
          <h4>RCSAS EDUCATIONS</h4>
        </div>

        {/* Middle Section - Contact Details */}
        <div className="footer-contact">
          <p>
            <span>📧</span> <a href="mailto:rcsasedu@gmail.com">rcsasedu@gmail.com</a>
          </p>
          <p>
            <span>📞</span> 07122702727
          </p>
          <p>
            <span>📱</span> <a href="tel:+919422123456">9422123456</a>
          </p>
        </div>

        {/* Right Section - Social Links */}
        <div className="footer-social">
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png" alt="Facebook" width="24" />
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="24" />
  </a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="LinkedIn" width="24" />
  </a>
</div>
        
      </div>
    </footer>
  );
};

export default Footer;
