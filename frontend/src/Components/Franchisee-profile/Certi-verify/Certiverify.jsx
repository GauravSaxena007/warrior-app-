import React, { useState } from 'react';
import axios from 'axios';
import './Certiverify.css';

const Certiverify = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCertificate(null);
    setLoading(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificate/${certificateNumber}`);
      if (res.data) {
        setCertificate(res.data);
      } else {
        setError('No certificate found with this number.');
      }
    } catch (err) {
      console.error('Failed to fetch certificate:', err);
      setError('Wrong Certificate Number. Please Check Certificate Number Again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="verification-box">
        <h2 className="title">ENTER CERTIFICATE NUMBER :</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Certificate Number..."
            className="input-box"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'LOADING...' : 'SEE RESULT'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {certificate && (
          <div className="certificate-result">
            <h4>Certificate Details</h4>
            <p><strong>Student Name:</strong> {certificate.studentId?.name || 'N/A'}</p>
            <p><strong>Course:</strong> {certificate.course || 'N/A'}</p>
            <p><strong>Certificate Number:</strong> {certificate.certificateNumber}</p>
            <div className="certificate-view">
              <a
                href={`${import.meta.env.VITE_API_URL}/${certificate.filePath.replace(/\\/g, '/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-link"
              >
                View Certificate
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certiverify;