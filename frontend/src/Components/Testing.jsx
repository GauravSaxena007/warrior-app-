import React from "react";
import "./Testing.css";


const Testing = () => {
  return (
    <div className="certificate-container">
      {/* Certificate Border */}
      <div className="certificate-border">
        {/* Header Section */}
        <div className="certificate-header">
          <img src={""} alt="Logo" className="certificate-logo" />
          <h1 className="certificate-title">RCSAS EDUCATIONS</h1>
          <p className="certificate-subtitle">
            Ministry of Corporate Affairs (Govt. of India) <br />
            Govt. Reg. No: U 72900 MH 2016 PTC 281145 <br />
            An ISO Certified Company
          </p>
        </div>

        {/* Main Certificate Content */}
        <h2 className="certificate-heading">Certificate</h2>

        <div className="certificate-details">
          <p><strong>No.</strong> 535564/RCSAS/19</p>
          <p><strong>Date:</strong> 31-08-2019</p>
        </div>

        <p className="certificate-text">
          This is to certify that Shri / Smt. / Ku. <br />
          <span className="certificate-name">RESHAM SINGH SO AVTAR SINGH</span>
        </p>

        <p className="certificate-text">
          having been examined and found proficient in <br />
          <span className="certificate-course">Advanced Diploma in Computer Application</span>
        </p>

        <p className="certificate-text">
          Conducted by <span className="certificate-institute">RCSAS Educations Private Limited</span>
        </p>

        <p className="certificate-duration">
          For <span className="highlight">12 months</span> and is being awarded this certificate.
        </p>

        <p className="certificate-grade">
          He/She has been placed in Grade: <span className="highlight">A</span>
        </p>

        {/* Signature and Seal */}
        <div className="certificate-footer">
          <img src={""} alt="User" className="certificate-photo" />
          <div className="certificate-signature">
            <p>Authorized Signatory</p>
            <div className="signature-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testing;
