import React, { useEffect, useState } from "react";
import "./Franchprofile.css";

const FranchProfile = () => {
  const [franchisee, setFranchisee] = useState(null);

  useEffect(() => {
    const fetchFranchisee = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/franchisee/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch franchisee");
        }

        const data = await res.json();
        setFranchisee(data);
      } catch (err) {
        console.error("Failed to load franchisee profile:", err);
      }
    };

    fetchFranchisee();
  }, []);

  if (!franchisee) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header pro-h mx-auto text-left" style={{ width: '100%', marginTop: '20px' }}>Franchisee Profile</div>

      <div className="profile-table">
        <table>
          <tbody>
            <tr>
              <td><strong>Center Name</strong></td>
              <td>{franchisee.centerName}</td>
              <td><strong>Center Head:</strong></td>
              <td>{franchisee.centerHead}</td>
            </tr>
            <tr>
              <td><strong>Center Validity:</strong></td>
              <td>{franchisee.renewalDate}</td>
              <td><strong>Email:</strong></td>
              <td>{franchisee.email}</td>
            </tr>
            <tr>
              <td><strong>Registration Number</strong></td>
              <td>{franchisee.registrationNumber}</td>
              <td><strong>Pin Code :</strong></td>
              <td>{franchisee.pincode}</td>
            </tr>
            <tr>
              <td><strong>Address</strong></td>
              <td colSpan="3">{franchisee.area}, {franchisee.city}, {franchisee.state}</td>
            </tr>
          </tbody>
        </table>

        {/* Profile Image Section */}
        <div className="profile-section">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${franchisee.photo}`}
            alt="Profile"
            className="profile-img"
          />
          <p className="profile-text">Profile Small <br /> 200px X 200px</p>
          <button className="profile-button">CHANGE PROFILE</button>
        </div>
      </div>

      <p className="profile-note">
        Note: Profile Image size Exact 200px By 200px. (Only JPG, JPEG, PNG Format Supported)
      </p>
    </div>
  );
};

export default FranchProfile;
