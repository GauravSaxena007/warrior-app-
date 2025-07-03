import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './Certiverify.css';

const Certiverify = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [matchedCertificate, setMatchedCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isManual, setIsManual] = useState(false);

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
        const { data: manualCertificates } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/manualcerti`
        );

        const manualMatch = manualCertificates.find(
          (cert) => cert.certificateNumber.toUpperCase() === trimmedCertNo
        );

        if (manualMatch) {
          console.log('Manual Certificate:', JSON.stringify(manualMatch, null, 2));
          setMatchedCertificate(manualMatch);
          setIsManual(true);
        } else {
          setError('No Marksheet/Certificate found for the given Enrollment Number. Please check and try again.');
        }
      }
    } catch (err) {
      console.error('Error verifying certificate:', err.response?.data || err.message);
      setError('Failed to verify the certificate. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  const renderMarksheetHTML = (htmlContent) => {
    if (!htmlContent) {
      console.log('No marksheetHTML provided');
      return (
        <div className="marksheet-container">
          <div className="marksheet-section">
            <div className="marksheet-header">
              <img src="https://via.placeholder.com/120" alt="Institute Logo" className="marksheet-logo" />
              <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
              <h3>National Institute of Commerce and Technical Training</h3>
              <h2 className="marksheet-title">Marksheet</h2>
            </div>
            <p>No Marksheet Available</p>
          </div>
        </div>
      );
    }

    const logoUrl = `${window.location.origin}/main-logo.png`;
    const sanitizedHTML = DOMPurify.sanitize(
      htmlContent.replace(/src="main-logo\.png"/g, `src="${logoUrl}"`)
    );
    console.log('Rendering sanitized marksheetHTML:', sanitizedHTML.slice(0, 200) + '...');
    return <div className="marksheet-container" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
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
                  <th>Certificate</th>
                  <th>Marksheet</th>
                  <th>Marksheet HTML</th>
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
                    {buildFileUrl(
                      isManual
                        ? matchedCertificate.certificateFile || matchedCertificate.file
                        : matchedCertificate.certificatePath
                    ) ? (
                      <a
                        href={buildFileUrl(
                          isManual
                            ? matchedCertificate.certificateFile || matchedCertificate.file
                            : matchedCertificate.certificatePath
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm"
                        aria-label="View Certificate"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-muted">Certificate Unavailable</span>
                    )}
                  </td>
                  <td>
                    {buildFileUrl(
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
                        aria-label="View Marksheet"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-muted">Marksheet Unavailable</span>
                    )}
                  </td>
                  <td>
                    {isManual && matchedCertificate.marksheetHTML ? (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => renderMarksheetHTML(matchedCertificate.marksheetHTML)}
                        aria-label="View HTML Marksheet"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-muted">Marksheet HTML Unavailable</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            {isManual && matchedCertificate.marksheetHTML && renderMarksheetHTML(matchedCertificate.marksheetHTML)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certiverify;