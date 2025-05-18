import React, { useState, useEffect } from "react";
import "./Settings.css";
import axios from "axios";

const Settings = () => {
  const [photo, setPhoto] = useState(null);
  const [franchiseNumber, setFranchiseNumber] = useState("9422123456");
  const [welcomeTitle, setWelcomeTitle] = useState("WELCOME TO RCSAS COMPUTER EDUCATION FRANCHISE");
  const [welcomeText, setWelcomeText] = useState("RCSAS Education provides the best computer education franchise business opportunity in India...");

  const [footerLogo, setFooterLogo] = useState(null);
  const [email, setEmail] = useState("rcsasedu@gmail.com");
  const [phone1, setPhone1] = useState("07122702727");
  const [phone2, setPhone2] = useState("9422123456");
  const [socialLinks, setSocialLinks] = useState(["https://facebook.com", "https://instagram.com"]);

  useEffect(() => {
    // Fetch initial settings from backend
    axios.get(`${import.meta.env.VITE_API_URL}/settings`)
      .then((response) => {
        const data = response.data;
        console.log("Fetched settings:", data); // Debug log
        setPhoto(data.photo ? `${import.meta.env.VITE_API_URL}/${data.photo}` : null);
        setFranchiseNumber(data.franchiseNumber || "9422123456");
        setWelcomeTitle(data.welcomeTitle || "WELCOME TO RCSAS COMPUTER EDUCATION FRANCHISE");
        setWelcomeText(data.welcomeText || "RCSAS Education provides the best computer education franchise business opportunity in India...");
        setFooterLogo(data.footerLogo ? `${import.meta.env.VITE_API_URL}/${data.footerLogo}` : null);
        setEmail(data.email || "rcsasedu@gmail.com");
        setPhone1(data.phone1 || "07122702727");
        setPhone2(data.phone2 || "9422123456");
        setSocialLinks(data.socialLinks || ["https://facebook.com", "https://instagram.com"]);
      })
      .catch((error) => console.error("Error fetching settings:", error));
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file); // Store file object instead of URL for upload
    }
  };

  const handleFooterLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFooterLogo(file); // Store file object instead of URL for upload
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  const handleDeleteSocialLink = (index) => {
    const updated = [...socialLinks];
    updated.splice(index, 1);
    setSocialLinks(updated);
  };

  const handleSocialLinkChange = (index, value) => {
    const updated = [...socialLinks];
    updated[index] = value;
    setSocialLinks(updated);
  };

  const handleSave = () => {
    const formData = new FormData();
    if (photo && typeof photo !== "string") formData.append("photo", photo);
    formData.append("franchiseNumber", franchiseNumber);
    formData.append("welcomeTitle", welcomeTitle);
    formData.append("welcomeText", welcomeText);
    if (footerLogo && typeof footerLogo !== "string") formData.append("footerLogo", footerLogo);
    formData.append("email", email);
    formData.append("phone1", phone1);
    formData.append("phone2", phone2);
    formData.append("socialLinks", JSON.stringify(socialLinks));

    axios.post(`${import.meta.env.VITE_API_URL}/settings`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        console.log("Save response data:", response.data); // Debug log
        alert("Changes saved successfully!");
        // Refresh settings to update logo URLs
        axios.get(`${import.meta.env.VITE_API_URL}/settings`)
          .then((res) => {
            const data = res.data;
            console.log("Refreshed settings:", data); // Debug log
            setPhoto(data.photo ? `${import.meta.env.VITE_API_URL}/${data.photo}` : null);
            setFooterLogo(data.footerLogo ? `${import.meta.env.VITE_API_URL}/${data.footerLogo}` : null);
          });
      })
      .catch((error) => {
        console.error("Error saving settings:", error);
        alert("Failed to save changes.");
      });
  };

  return (
    <div className="settings-grid">
      {/* Main Settings */}
      <div className="settings-container settings-main">
        <h2 className="settings-title">Main Settings</h2>

        <div className="form-group">
          <label>Upload Photo:</label>
          <input type="file" onChange={handlePhotoChange} />
          {photo && typeof photo === "string" && <img src={photo} alt="Preview" className="preview-img" />}
        </div>

        <div className="form-group">
          <label>Franchisee Enquiry Number:</label>
          <input
            type="text"
            value={franchiseNumber}
            onChange={(e) => setFranchiseNumber(e.target.value)}
          />
        </div>

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
      </div>

      {/* Footer Settings */}
      <div className="settings-container settings-footer">
        <h2 className="settings-title">Footer Settings</h2>

        <div className="form-group">
          <label>Footer Logo:</label>
          <input type="file" onChange={handleFooterLogoChange} />
          {footerLogo && typeof footerLogo === "string" && <img src={footerLogo} alt="Footer Logo" className="preview-img" />}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone Number 1:</label>
          <input
            type="text"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Phone Number 2:</label>
          <input
            type="text"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Social Media Links:</label>
          {socialLinks.map((link, index) => (
            <div key={index} className="social-input-row">
              <input
                type="text"
                value={link}
                onChange={(e) => handleSocialLinkChange(index, e.target.value)}
              />
              <button onClick={() => handleDeleteSocialLink(index)}>Delete</button>
            </div>
          ))}
          <button onClick={handleAddSocialLink}>Add Social Link</button>
        </div>
      </div>

      {/* Save Button Full Width */}
      <div className="save-btn-wrapper">
        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;