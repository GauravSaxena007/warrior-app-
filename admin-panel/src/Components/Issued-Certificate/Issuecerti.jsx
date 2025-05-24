import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Issuecerti.css';

const Issuecerti = () => {
  const [requests, setRequests] = useState([]);
  const [certData, setCertData] = useState([]);
  const [courses, setCourses] = useState([]); // New state for courses

  // Fetch certificate requests
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch courses to get semester information
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        alert('Failed to fetch course data.');
      }
    };
    fetchCourses();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests`);
      setRequests(res.data);
      setCertData(res.data.map(() => ({ certNo: '', file: null, marksheet: null }))); // Added marksheet
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

    if (!certInfo.certNo || !certInfo.file || !certInfo.marksheet || !request?.studentId?._id || !request._id) {
      alert('Missing required data: certificate number, file, marksheet, student ID, or request ID.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('certificateNumber', certInfo.certNo);
      formData.append('file', certInfo.file);
      formData.append('marksheet', certInfo.marksheet); // Uploading marksheet
      formData.append('studentId', request.studentId._id);

      // Send certificate
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests/${request._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // Delete the request after sending
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests/${request._id}`);

      alert(`Certificate sent and request deleted for ${request.studentId.name || 'Unknown Student'}`);
      // Update local state
      setRequests(requests.filter((_, i) => i !== index));
      setCertData(certData.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error processing certificate:', err.response?.data, err.message);
      alert(
        err.response?.data?.message ||
        'An error occurred while processing the certificate. Please check server logs.'
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
              <th>Semester</th>
              <th>Subjects & Marks</th>
              <th>Assign Certificate Number</th>
              <th>Upload Certificate</th>
              <th>Upload Marksheet</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const student = req?.studentId || {};
              const cert = certData[index] || { certNo: '', file: null, marksheet: null };
              const course = courses.find((c) => c.title === student.course);
              const semester = course?.semester || 'Not Assigned';
              const obtainMarks = student.obtainMarks || [];

              return (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{student.name || 'N/A'}</td>
                  <td>{student.mobile || 'N/A'}</td>
                  <td>{student.course || 'N/A'}</td>
                  <td>{student.franchiseeHead || 'N/A'}</td>
                  <td>{semester}</td>
                  <td>
                    {obtainMarks.length > 0 ? (
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          const newTab = window.open();
                          const htmlContent = `
                            <html>
                              <head><title>Subjects & Marks</title></head>
                              <body>
                                <h2>Subjects & Marks for ${student.name}</h2>
                                <ul>
                                  ${obtainMarks
                                    .map(
                                      (mark) =>
                                        `<li>${mark.subject}: ${mark.obtained}/${mark.maxMarks} (Pass: ${mark.passingMarks})</li>`
                                    )
                                    .join('')}
                                </ul>
                              </body>
                            </html>
                          `;
                          newTab.document.write(htmlContent);
                          newTab.document.close();
                        }}
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        View Subjects & Marks
                      </a>
                    ) : (
                      'No marks available'
                    )}
                  </td>
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
                  <td>
                    <input
                      type="file"
                      className="form-control-isa"
                      accept=".pdf"
                      onChange={(e) => handleCertChange(index, 'marksheet', e.target.files[0])}
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
