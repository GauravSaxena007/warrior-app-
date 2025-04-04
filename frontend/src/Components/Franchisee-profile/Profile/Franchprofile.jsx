import React from "react";
import "./Franchprofile.css"; // Importing external CSS


const FranchProfile = () => {
  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">Franchisee Profile</div>

      {/* Profile Details */}
      <div className="profile-table">
        <table>
          <tbody>
            <tr>
              <td><strong>Center Name</strong></td>
              <td>BUNDI (GALAXY COMPUTER EDUCATION)</td>
              <td><strong>Center Head:</strong></td>
              <td>DHARMENDRA KUMAR PAHUJA</td>
            </tr>
            <tr>
              <td><strong>Center Validity:</strong></td>
              <td>30-09-2025</td>
              <td><strong>Email:</strong></td>
              <td>gcebundi@gmail.com</td>
            </tr>
            <tr>
              <td><strong>Registration Number</strong></td>
              <td>7061</td>
              <td><strong>Pin Code :</strong></td>
              <td>323001</td>
            </tr>
            <tr>
              <td><strong>Address</strong></td>
              <td colSpan="3">GURU NANAK COLONY, BUNDI (RAJASTHAN)</td>
            </tr>
          </tbody>
        </table>

        {/* Profile Image Section */}
        <div className="profile-section">
          <img src={""} alt="Profile" className="profile-img" />
          <p className="profile-text">Profile Small <br /> 200px X 200px</p>
          <button className="profile-button">CHANGE PROFILE</button>
        </div>
      </div>

      {/* Note */}
      <p className="profile-note">
        Note: Profile Image size Exact 200px By 200px. (Only JPG, JPEG, PNG Format Supported)
      </p>
    </div>
  );
};

export default FranchProfile;
