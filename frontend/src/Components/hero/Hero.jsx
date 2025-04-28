import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Hero.css";
import img1 from "../../assets/warrior caro5.jpg";
import img2 from "../../assets/warrior caro4.jpg";
import img3 from "../../assets/warrior caro1.jpg";

const Hero = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    area: "",
  });

  const [carouselImages, setCarouselImages] = useState([]);

  // Fetch images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/carousel`);
        const data = await response.json();
        setCarouselImages(data);
      } catch (err) {
        console.error("Error fetching carousel images:", err);
      }
    };
    fetchImages();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/enquiries`, formData);
      alert("Enquiry submitted successfully!");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        state: "",
        city: "",
        area: "",
      });
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="hero-container">
      {/* Left side - Banner Image with Text */}
      <div className="hero-left">
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          <div className="carousel-inner">
            {carouselImages.length > 0 ? (
              carouselImages.map((img, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={index}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${img.url}`}
                    className="d-block w-100"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))
            ) : (
              <div className="carousel-item active">
                <img
                  src="https://via.placeholder.com/800x400"
                  className="d-block w-100"
                  alt="Placeholder"
                />
              </div>
            )}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Right side - Franchisee Enquiry Form */}
      <div className="hero-right">
        <h2 className="form-title-1">FRANCHISEE ENQUIRY FORM</h2>
        <form className="enquiry-form" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="mobile"
            type="text"
            placeholder="Mobile No"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            {/* Add other states here */}
          </select>
          <input
            name="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            name="area"
            type="text"
            placeholder="Area"
            value={formData.area}
            onChange={handleChange}
            required
          />
          <button type="submit" className="enquiry-btn">
            Enquiry Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
