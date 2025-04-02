import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Franchiseecerti.css";

const Franchiseecerti = () => {
  const [name, setName] = useState("Your Name");
  const [membershipNo, setMembershipNo] = useState("0000");
  const [validUpto, setValidUpto] = useState("DD-MM-YYYY");
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCertificate = () => {
    const certificateElement = document.getElementById("certificate");
    html2canvas(certificateElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 200);
      pdf.save("certificate.pdf");
    });
  };

  return (
    <div>
       <h4 className="text-white p-2 bg-success mx-auto text-left m-5" style={{ width: "65%" }}>
  Franchisee Certificate
</h4>
    
    <div className="certificate-container">
      <div className="input-section">
        <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Membership No" value={membershipNo} onChange={(e) => setMembershipNo(e.target.value)} />
        <input type="date" onChange={(e) => setValidUpto(e.target.value)} />
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        <button onClick={downloadCertificate}>Download PDF</button>
      </div>

      <div id="certificate" className="certificate">
        <h2>FRANCHISEE CERTIFICATE</h2>
        <p>M/s. <strong>{name}</strong> is an authorized center.</p>
        <p>Membership No: <strong>{membershipNo}</strong> is valid upto <strong>{validUpto}</strong></p>
        {photo && <img src={photo} alt="Uploaded" className="certificate-photo" />}
      </div>
    </div>
    </div>
  );
};

export default Franchiseecerti;
