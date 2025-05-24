import React, { useState } from 'react';
import axios from 'axios';
import './Certiverify.css';

const Certiverify = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [matchedCertificate, setMatchedCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMatchedCertificate(null);
    setLoading(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/issuedCertificates`);
      const allCertificates = res.data;

      const match = allCertificates.find(cert => cert.certificateNumber === certificateNumber.trim());

      if (match) {
        setMatchedCertificate(match);
      } else {
        setError('Wrong Enrollment Number. Please Check Enrollment Number Again.');
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
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
            required
          />
          <button
            type="submit"
            className="submit-btn mt-2"
            disabled={loading}
          >
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
                  <td>{matchedCertificate.studentId?.name || 'N/A'}</td>
                  <td>{matchedCertificate.studentId?.mobile || 'N/A'}</td>
                  <td>{matchedCertificate.course || 'N/A'}</td>
                  <td>{matchedCertificate.certificateNumber}</td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/${matchedCertificate.filePath.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </a>
                  </td>
                  <td>
                    {matchedCertificate.marksheetPath ? (
                      <a
                        href={`${import.meta.env.VITE_API_URL}/${matchedCertificate.marksheetPath.replace(/\\/g, '/')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm"
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
