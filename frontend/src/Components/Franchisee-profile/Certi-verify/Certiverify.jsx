import React from "react";
import "./Certiverify.css"; // Ensure this file exists in the same directory

const Certiverify = () => {
  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      
      {/* Verification Box */}
      <div className="verification-box">
        <h2 className="title">ENTER CERTIFICATE NUMBER :</h2>

        <input
          type="text"
          placeholder="Enter Certificate Number..."
          className="input-box"
        />

        <button className="submit-btn">SEE RESULT</button>
      </div>
    </div>
  );
};

export default Certiverify;
