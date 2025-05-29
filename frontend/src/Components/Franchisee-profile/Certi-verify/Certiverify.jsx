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
          setMatchedCertificate(manualMatch);
          setIsManual(true);
        } else {
          setError('No certificate found for the given Enrollment Number. Please check and try again.');
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
    if (!filePath) return null;
    // Normalize slashes and handle relative paths
    const normalizedPath = filePath.replace(/\\/g, '/');
    if (normalizedPath.startsWith('uploads/')) {
      return `${import.meta.env.VITE_API_URL}/${normalizedPath}`;
    } else {
      // Default to /uploads/certificates folder for manual certificates or others
      return `${import.meta.env.VITE_API_URL}/uploads/certificates/${normalizedPath}`;
    }
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
                  <th>Enrollment No</th>
                  <th>View Certificate</th>
                  <th>View Marksheet</th>
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
                        ? matchedCertificate.certificateFile || matchedCertificate.certificatePath
                        : matchedCertificate.filePath
                    ) ? (
                      <a
                        href={buildFileUrl(
                          isManual
                            ? matchedCertificate.certificateFile || matchedCertificate.certificatePath
                            : matchedCertificate.filePath
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                        aria-label="View Certificate"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-muted">N/A</span>
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
                      <span className="text-muted">N/A</span>
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
