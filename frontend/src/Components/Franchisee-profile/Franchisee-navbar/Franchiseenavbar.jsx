import React, { useState } from "react";
import "./FranchiseeNavbar.css"; // Updated CSS filename
import StudentRegistration from "../Student-registration/StudentRegistration";


const FranchiseeNavbar = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

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

      {/* Green Active Tab Indicator */}
      <div className="franch-active-tab-indicator">{activeTab}</div>

      {/* Conditional Rendering of Student Registration */}
      {activeTab === "Student Registration" && <StudentRegistration/>}
    </div>
  );
};

export default FranchiseeNavbar;
