import React, { useState, useEffect } from "react";
import "./Slider.css";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // To handle loading state

  // Fetch images from backend
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/carousel");
        const data = await response.json();
        setImages(data); // Dynamically set images fetched from the backend
      } catch (err) {
        console.error("Error fetching carousel images:", err);
      }
    };
    fetchImages();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files.slice(0, 7 - images.length)); // Make sure not to exceed max images
  };

  const handleAddImages = async () => {
    if (selectedImages.length + images.length > 7) {
      alert("Max 7 images allowed.");
      return;
    }

    setIsLoading(true); // Set loading state to true while adding images

    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("http://localhost:5000/api/carousel", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const updatedImages = await response.json();
        setImages(updatedImages);
        setSelectedImages([]);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Error adding images:", err);
      alert("Failed to add images.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleDeleteImage = async (index) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/carousel/${index}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedImages = await response.json();
        setImages(updatedImages);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all images?")) return;

    try {
      const response = await fetch("http://localhost:5000/api/carousel", {
        method: "DELETE",
      });
      if (response.ok) {
        setImages([]);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Error deleting all images:", err);
      alert("Failed to delete all images.");
    }
  };

  return (
    <div className="carousel-manager">
      <h2>Carousel Image Manager</h2>

      {/* Show currently used images from the backend */}
      <div className="current-carousel">
        <h4>Images Currently Used in Carousel:</h4>
        <div className="carousel-gallery">
          {images.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000${img.url}`}
              alt={`Current ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Add new images section */}
      {selectedImages.length > 0 && (
        <div className="preview-image">
          <h4>Preview Selected Images:</h4>
          <div className="carousel-gallery">
            {selectedImages.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`Preview ${i}`}
              />
            ))}
          </div>
          <button
            onClick={handleAddImages}
            className="btn-add"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Adding..." : "Add to Carousel"}
          </button>
        </div>
      )}

      {/* Image upload input */}
      <div className="upload-section">
        <label>Upload Images: (800*400 pixels) </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={images.length >= 7 || isLoading} // Disable when max images are reached or loading
        />
      </div>

      {/* Show images added by admin */}
      <div className="current-carousel">
        <h4>Admin Added Images ({images.length}/7)</h4>
        <div className="carousel-gallery">
          {images.map((img, index) => (
            <div className="carousel-item-box" key={index}>
              <img
                src={`http://localhost:5000${img.url}`}
                alt={`Slide ${index + 1}`}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="btn-delete"
                disabled={isLoading} // Disable delete while loading
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save & Delete All Buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          className="btn-save"
          onClick={handleAddImages}
          disabled={isLoading} // Disable while loading
        >
          Save
        </button>
        <button
          className="btn-delete-all"
          onClick={handleDeleteAll}
          disabled={isLoading} // Disable while loading
        >
          Delete All
        </button>
      </div>
    </div>
  );
};

export default Slider;
