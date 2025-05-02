import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Issuecerti.css';

const Issuecerti = () => {
  const [requests, setRequests] = useState([]);
  const [certData, setCertData] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests`);
      setRequests(res.data);
      setCertData(res.data.map(() => ({ certNo: '', file: null })));
    } catch (err) {
      console.error('Error fetching certificate requests:', err);
      alert('Failed to fetch certificate requests.');
    }
  };

  const handleCertChange = (index, field, value) => {
    const updated = [...certData];
    updated[index][field] = value;
    setCertData(updated);
  };

  const handleSend = async (index) => {
    const request = requests[index];
    const certInfo = certData[index];

    if (!certInfo.certNo || !certInfo.file || !request?.studentId?._id || !request._id) {
      alert('Missing required data: certificate number, file, student ID, or request ID.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('certificateNumber', certInfo.certNo);
      formData.append('file', certInfo.file);
      formData.append('studentId', request.studentId._id);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests/${request._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert(`Certificate sent for ${request.studentId.name || 'Unknown Student'}`);
      // Remove the sent request from the local state
      setRequests(requests.filter((_, i) => i !== index));
      setCertData(certData.filter((_, i) => i !== index));
      // fetchRequests(); // Commented out to avoid refetching all requests
    } catch (err) {
      console.error('Error sending certificate:', err.response?.data, err.message);
      alert(
        err.response?.data?.message ||
        'An error occurred while sending the certificate. Please check server logs.'
      );
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this request?');
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests/${id}`);
      alert('Certificate request deleted.');
      fetchRequests();
    } catch (err) {
      console.error('Error deleting certificate request:', err);
      alert('Failed to delete request.');
    }
  };

  return (
    <div className="container-iss-certi-adm">
      <h4 className="mb-3">Issue Certificates</h4>

      {requests.length === 0 ? (
        <p>No certificate requests found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Course Name</th>
              <th>Franchisee Head</th>
              <th>Assign Certificate Number</th>
              <th>Upload Certificate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const student = req?.studentId || {};
              const cert = certData[index] || { certNo: '', file: null };

              return (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{student.name || 'N/A'}</td>
                  <td>{student.mobile || 'N/A'}</td>
                  <td>{student.course || 'N/A'}</td>
                  <td>{student.franchiseeHead || 'N/A'}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter cert. no."
                      value={cert.certNo}
                      onChange={(e) => handleCertChange(index, 'certNo', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      className="form-control-isa"
                      accept=".pdf"
                      onChange={(e) => handleCertChange(index, 'file', e.target.files[0])}
                    />
                  </td>
                  <td className="d-flex gap-2 flex-column flex-md-row">
                    <button className="btn btn-success btn-sm" onClick={() => handleSend(index)}>
                      Send
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(req._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Issuecerti;