import React, { useState, useEffect } from "react";
import img1 from "../../assets/warrior caro5.jpg";
import img2 from "../../assets/warrior caro4.jpg";
import img3 from "../../assets/warrior caro1.jpg";
import "./Slider.css";

const Slider = () => {
  // Initial hardcoded carousel images (from Hero)
  const existingCarousel = [img1, img2, img3];

  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("carouselImages");
    if (stored) {
      setImages(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carouselImages", JSON.stringify(images));
  }, [images]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(urls.slice(0, 7 - images.length));
  };

  const handleAddImages = () => {
    if (selectedImages.length + images.length > 7) {
      alert("Max 7 images allowed.");
      return;
    }
    setImages([...images, ...selectedImages]);
    setSelectedImages([]);
  };

  const handleDeleteImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  return (
    <div className="carousel-manager">
      <h2>Carousel Image Manager</h2>

      {/* Show currently used images from Hero.jsx */}
      <div className="current-carousel">
        <h4>Images Currently Used in Carousel :</h4>
        <div className="carousel-gallery">
          {existingCarousel.map((img, i) => (
            <img key={i} src={img} alt={`Current ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Add new images section */}
      {selectedImages.length > 0 && (
        <div className="preview-image">
          <h4>Preview Selected Images:</h4>
          <div className="carousel-gallery">
            {selectedImages.map((img, i) => (
              <img key={i} src={img} alt={`Preview ${i}`} />
            ))}
          </div>
          <button onClick={handleAddImages} className="btn-add">Add to Carousel</button>
        </div>
      )}

      <div className="upload-section">
        <label>Upload Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={images.length >= 7}
        />
      </div>

      {/* Custom images added via admin panel */}
      <div className="current-carousel">
        <h4>Admin Added Images ({images.length}/7)</h4>
        <div className="carousel-gallery">
          {images.map((img, index) => (
            <div className="carousel-item-box" key={index}>
              <img src={img} alt={`Slide ${index + 1}`} />
              <button onClick={() => handleDeleteImage(index)} className="btn-delete">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
