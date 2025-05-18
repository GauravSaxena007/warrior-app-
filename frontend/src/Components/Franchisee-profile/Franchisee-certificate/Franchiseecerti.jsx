import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF
import "./Franchiseecerti.css";

const Franchiseecerti = () => {
  const [certificates, setCertificates] = useState([]);
  const [franchisees, setFranchisees] = useState([]);
  const [centerHead, setCenterHead] = useState("");
  const [loading, setLoading] = useState(true);
  const printRefs = useRef({}); // to store refs for each cert

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certRes = await axios.get(`${import.meta.env.VITE_API_URL}/fra-certificates`);
        const franRes = await axios.get(`${import.meta.env.VITE_API_URL}/franchisee`);

        setCertificates(certRes.data);
        setFranchisees(franRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    const fetchFranchiseeHead = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/franchisee/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCenterHead(res.data.centerHead);
      } catch (err) {
        console.error("Failed to load franchisee head:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchFranchiseeHead();
  }, []);

  const handlePrint = (id) => {
    const content = printRefs.current[id];
    if (content) {
      const imgElement = content.querySelector("img"); // Select the img element
      if (imgElement) {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.src = imgElement.src;
        img.onload = () => {
          try {
            const pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4",
            });
            const imgWidth = 190; // Fit within A4 width (210mm - margins)
            const imgHeight = (img.height * imgWidth) / img.width; // Maintain aspect ratio
            pdf.addImage(img, "JPEG", 10, 10, imgWidth, imgHeight);
            pdf.save(`certificate_${id}.pdf`);
          } catch (err) {
            console.error("Failed to generate PDF:", err);
            // Fallback to original print behavior
            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print Certificate</title>
                  <style>
                    body { margin: 0; padding: 0; text-align: center; }
                    img { max-width: 100%; height: auto; }
                  </style>
                </head>
                <body>
                  ${imgElement.outerHTML}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
          }
        };
        img.onerror = () => {
          console.error("Failed to load image for PDF");
          // Fallback to original print behavior
          const printWindow = window.open("", "_blank");
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Certificate</title>
                <style>
                  body { margin: 0; padding: 0; text-align: center; }
                  img { max-width: 100%; height: auto; }
                </style>
              </head>
              <body>
                ${imgElement.outerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        };
      } else {
        // Fallback to original print behavior if no img
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Certificate</title>
              <style>
                body { margin: 0; padding: 0; text-align: center; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              ${content.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return <p>Loading certificates...</p>;
  }

  return (
    <div className="fran-cert-container">
      <h4 className="pro-h p-2.5 mx-auto text-left " style={{ width: "90%" , marginTop: '-5px' }}>
        Franchisee Certificates
      </h4>

      <div style={{ width: "80%", margin: "auto" }}>
        {certificates
          .filter((cert) => {
            const fran = franchisees.find((f) => f._id === cert.franchisee);
            return centerHead
              ? fran?.centerHead?.trim().toLowerCase() === centerHead?.trim().toLowerCase()
              : false;
          })
          .map((cert, index) => {
            const fran = franchisees.find((f) => f._id === cert.franchisee);
            return (
              <div key={cert._id} className="certificate-card">
                <div className="fran-head-print">
                  <p><strong>Franchisee Head:</strong> {fran?.centerHead || "Unknown"}</p>
                  <button onClick={() => handlePrint(cert._id)} className="print-btn">
                    Print Certificate
                  </button>
                </div>
                <div
                  className="certificate-image"
                  ref={(el) => (printRefs.current[cert._id] = el)}
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${cert.photo}`}
                    alt="Franchisee Certificate"
                    style={{ width: "100%", maxWidth: "700px", marginBottom: "10px" }}
                  />
                </div>

                <hr />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Franchiseecerti;