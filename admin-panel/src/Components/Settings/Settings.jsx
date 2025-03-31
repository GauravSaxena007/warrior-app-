import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [photo, setPhoto] = useState(null);
  const [franchiseNumber, setFranchiseNumber] = useState("9422123456");
  const [welcomeTitle, setWelcomeTitle] = useState("WELCOME TO RCSAS COMPUTER EDUCATION FRANCHISE");
  const [welcomeText, setWelcomeText] = useState("RCSAS Education provides the best computer education franchise business opportunity in India...");

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const updatedData = {
      photo,
      franchiseNumber,
      welcomeTitle,
      welcomeText,
    };
    console.log("Updated Data:", updatedData);
    alert("Changes saved successfully!"); // Replace with an API call if needed
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Update Settings</h2>

      {/* Photo Upload */}
      <div className="form-group">
        <label>Upload Photo:</label>
        <input type="file" onChange={handlePhotoChange} />
        {photo && <img src={photo} alt="Preview" className="preview-img" />}
      </div>

      {/* Franchisee Enquiry Number */}
      <div className="form-group">
        <label>Franchisee Enquiry Number:</label>
        <input
          type="text"
          value={franchiseNumber}
          onChange={(e) => setFranchiseNumber(e.target.value)}
        />
      </div>

      {/* Welcome Section */}
      <div className="form-group">
        <label>Welcome Title:</label>
        <input
          type="text"
          value={welcomeTitle}
          onChange={(e) => setWelcomeTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Welcome Description:</label>
        <textarea
          rows="4"
          value={welcomeText}
          onChange={(e) => setWelcomeText(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
