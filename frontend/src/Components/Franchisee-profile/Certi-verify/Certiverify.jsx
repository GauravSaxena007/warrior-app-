import React, { useState } from 'react';
import axios from 'axios';
import './Certiverify.css';

const Certiverify = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [matchedCertificate, setMatchedCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isManual, setIsManual] = useState(false); // Flag: manual vs issued

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCertNo = certificateNumber.trim().toUpperCase();
    if (!trimmedCertNo) {
      setError('Please enter an Enrollment Number.');
      return;
    }

    setError('');
    setMatchedCertificate(null);
    setIsManual(false);
    setLoading(true);

    try {
      // Fetch issued certificates first
      const { data: issuedCertificates } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin-certi/issuedCertificates`
      );

      const issuedMatch = issuedCertificates.find(
        (cert) => cert.certificateNumber.toUpperCase() === trimmedCertNo
      );

      if (issuedMatch) {
        console.log('Issued Certificate:', issuedMatch);
        setMatchedCertificate(issuedMatch);
        setIsManual(false);
      } else {
        // If no issued match, check manual certificates
        const { data: manualCertificates } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/manualcerti`
        );

        const manualMatch = manualCertificates.find(
          (cert) => cert.certificateNumber.toUpperCase() === trimmedCertNo
        );

        if (manualMatch) {
          console.log('Manual Certificate:', manualMatch);
          setMatchedCertificate(manualMatch);
          setIsManual(true);
        } else {
          setError('No Marksheet/Certificate found for the given Enrollment Number. Please check and try again.');
        }
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError('Failed to verify the certificate. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Build full URL for certificate or marksheet file
  const buildFileUrl = (filePath) => {
    if (!filePath) {
      console.log('No filePath provided:', filePath);
      return null;
    }
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (normalizedPath.startsWith('uploads/')) {
      return `${import.meta.env.VITE_API_URL}/${normalizedPath}`;
    } else {
      return `${import.meta.env.VITE_API_URL}/uploads/certificates/${normalizedPath}`;
    }
  };

  // Function to open marksheet HTML in a new tab
  const openMarksheet = (htmlContent) => {
    const newTab = window.open();
    if (!newTab) {
      alert('Please allow pop-ups to view the marksheet.');
      return;
    }
    const logoUrl = `${window.location.origin}/main-logo.png`;
    const updatedHtmlContent = htmlContent
      ? htmlContent.replace(/src="main-logo\.png"/g, `src="${logoUrl}"`)
      : `
        <div class="Format-container">
          <div class="Format-section">
            <div class="Format-header">
              <img src="${logoUrl}" alt="Institute Logo" class="Format-logo" />
              <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
              <h3>National Institute of Commerce and Technical Training</h3>
              <h2 class="Format-title">Marksheet</h2>
            </div>
            <p>No Marksheet Available</p>
          </div>
        </div>
      `;
    console.log('Rendering HTML:', updatedHtmlContent); // Debug log
    newTab.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Marksheet</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px; }
          .Format-container { max-width: 900px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .Format-section { border: 2px solid #004aad; padding: 20px; border-radius: 8px; }
          .Format-header { text-align: center; margin-bottom: 20px; }
          .Format-logo { width: 120px; height: auto; margin-bottom: 15px; }
          .Format-header h2 { font-size: 24px; color: #004aad; margin: 5px 0; }
          .Format-header h3 { font-size: 18px; color: #333; margin: 5px 0; font-weight: 500; }
          .Format-title { font-size: 28px; color: #004aad; text-decoration: underline; font-weight: bold; margin-bottom: 20px; }
          .Format-info { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; font-size: 16px; color: #333; }
          .Format-info div { padding: 5px; }
          .Format-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px; }
          .Format-table th, .Format-table td { border: 1px solid #004aad; padding: 10px; text-align: center; color: #333; }
          .Format-table th { background-color: #e6f0ff; font-weight: 600; }
          .Format-table td { background-color: #fff; }
          .total-row { font-weight: bold; background-color: #d4e6ff; }
          .Format-summary { font-size: 16px; margin-bottom: 20px; }
          .Format-summary p { margin: 8px 0; color: #333; }
          .Format-footer { text-align: center; font-size: 14px; color: #555; margin-top: 30px; }
          .Format-footer p { margin: 5px 0; }
          @media print {
            body { background-color: #fff; padding: 0; }
            .Format-container { box-shadow: none; border: none; padding: 10px; }
            .Format-section { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        ${updatedHtmlContent}
      </body>
      </html>
    `);
    newTab.document.close();
  };

  return (
    <div className="container-verify">
      <div className="verification-box">
        <h2 className="title">ENTER ENROLLMENT NUMBER :</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Enrollment Number..."
            className="input-box"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="submit-btn mt-2" disabled={loading}>
            {loading ? 'VERIFYING...' : 'GET RESULT'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {matchedCertificate && (
          <div className="issued-certificates mt-4">
            <h4>Issued Certificate & Marksheet</h4>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Student Name</th>
                  <th>Mobile</th>
                  <th>Course</th>
                  <th>Enrollment No.</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {isManual
                      ? matchedCertificate.studentName || 'N/A'
                      : matchedCertificate.studentId?.name || 'N/A'}
                  </td>
                  <td>
                    {isManual
                      ? matchedCertificate.mobile || 'N/A'
                      : matchedCertificate.studentId?.mobile || 'N/A'}
                  </td>
                  <td>
                    {isManual
                      ? matchedCertificate.courseName || 'N/A'
                      : matchedCertificate.course || 'N/A'}
                  </td>
                  <td>{matchedCertificate.certificateNumber || 'N/A'}</td>
                  <td>
                    {isManual && matchedCertificate.marksheetHTML ? (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => openMarksheet(matchedCertificate.marksheetHTML)}
                        aria-label="View HTML Marksheet"
                      >
                        View
                      </button>
                    ) : buildFileUrl(
                        isManual
                          ? matchedCertificate.marksheetFile || matchedCertificate.marksheetPath
                          : matchedCertificate.marksheetPath
                      ) ? (
                      <a
                        href={buildFileUrl(
                          isManual
                            ? matchedCertificate.marksheetFile || matchedCertificate.marksheetPath
                            : matchedCertificate.marksheetPath
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm"
                        aria-label="View File Marksheet"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-muted">Marksheet Unavailable</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certiverify;