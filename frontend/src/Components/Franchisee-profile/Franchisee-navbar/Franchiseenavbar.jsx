import React, { useState } from "react";
import "./FranchiseeNavbar.css"; // Updated CSS filename
import StudentRegistration from "../Student-registration/StudentRegistration";
import Applycertificate from "../Apply-certificate/Applycertificate";
import Transaction from "../Transaction/Transaction";
import Issuedcertificate from "../Issued-certificate/Issuedcertificate";
import Franchiseecerti from "../Franchisee-certificate/Franchiseecerti";
import FranchProfile from "../Profile/Franchprofile";
import Courierdetail from "../Courier-detail/Courierdetail";

const FranchiseeNavbar = () => {
  // Set default active tab to "Student Registration"
  const [activeTab, setActiveTab] = useState("Student Registration");

  return (
    <div>
      {/* Tricolor Banner */}
      <div className="franch-tricolor-banner">
        <span className="franch-welcome-text">Welcome to Franchisee Panel</span>
      </div>

      {/* Navigation Bar */}
      <nav className="franch-navbar">
        <ul className="franch-nav-links">
          {[
            "Student Registration",
            "Profile",
            "Apply for Certificates",
            "Transactions",
            "Courier Details",
            "Issued Certificates",
            "Franchisee Certificate",
          ].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "franch-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      {/* Conditional Rendering of Components */}
      {activeTab === "Student Registration" && <StudentRegistration />}
      {activeTab === "Apply for Certificates" && <Applycertificate />}
      {activeTab === "Transactions" && <Transaction />}
      {activeTab === "Issued Certificates" && <Issuedcertificate />}
      {activeTab === "Franchisee Certificate" && <Franchiseecerti />}
      {activeTab === "Profile" && <FranchProfile/>}
      {activeTab === "Courier Details" && <Courierdetail/>}
    </div>
  );
};

export default FranchiseeNavbar;
