import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CertificatesV3 = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/issuedCertificates`);
      setCertificates(res.data);
    } catch (err) {
      console.error('Failed to fetch issued certificates:', err);
      alert('Failed to fetch issued certificates.');
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Issued Certificates</h4>
      {certificates.length === 0 ? (
        <p>No certificates issued yet.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Sr. No.</th>
              <th>Student Name</th>
              <th>Mobile</th>
              <th>Course</th>
              <th>Certificate No</th>
              <th>View PDF</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={cert._id}>
                <td>{index + 1}</td>
                <td>{cert.studentId?.name || 'N/A'}</td>
                <td>{cert.studentId?.mobile || 'N/A'}</td>
                <td>{cert.course || 'N/A'}</td>
                <td>{cert.certificateNumber}</td>
                <td>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/${cert.filePath.replace(/\\/g, '/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CertificatesV3;
