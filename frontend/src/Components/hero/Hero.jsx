import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Hero.css";
import img1 from "../../assets/warrior caro5.jpg";
import img2 from "../../assets/warrior caro4.jpg";
import img3 from "../../assets/warrior caro1.jpg";

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Left side - Banner Image with Text */}
      <div className="hero-left">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel" // Enable auto-slide
          data-bs-interval="5000" // 5-second interval
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={img1} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={img2} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={img3} className="d-block w-100" alt="Slide 3" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Right side - Franchisee Enquiry Form */}
      <div className="hero-right">
        <h2 className="form-title-1">FRANCHISEE ENQUIRY FORM</h2>
        <form className="enquiry-form">
          <input type="text" placeholder="Name" required />
          <input type="text" placeholder="Mobile No" required />
          <input type="email" placeholder="Email" required />
          <select required>
            <option value="">Select State</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
          </select>
          <input type="text" placeholder="City" required />
          <input type="text" placeholder="Area" required />
          <button type="submit" className="enquiry-btn">
            Enquiry Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
