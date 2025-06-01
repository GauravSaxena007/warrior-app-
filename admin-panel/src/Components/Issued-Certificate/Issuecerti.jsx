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
        `${import.meta.env.VITE_API_URL}/api/Admiadmin-certin-certi/certificateRequests/${request._id}`,
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
              <th>Assign Enrollment Number</th>
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
              const logoUrl = window.location.origin + '/main-logo.png';


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
                            <!DOCTYPE html>
                            <html>
                            <head>
                              <title>Subjects & Marks</title>
                              <style>
                                .Format-container {
                                  max-width: 800px;
                                  margin: 30px auto;
                                  padding: 30px;
                                  border: 2px solid #000;
                                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                  background-color: #fff;
                                  color: #000;
                                }
                                .Format-header {
                                  text-align: center;
                                  margin-bottom: 30px;
                                }
                                .Format-logo {
                                  width: 100px;
                                  height: auto;
                                  margin-bottom: 10px;
                                }
                                .Format-header h2 {
                                  margin: 5px 0;
                                  font-size: 20px;
                                }
                                .Format-header h3 {
                                  margin: 5px 0;
                                  font-size: 16px;
                                  font-weight: normal;
                                  color: #444;
                                }
                                .Format-title {
                                  margin-top: 20px;
                                  font-size: 24px;
                                  text-decoration: underline;
                                  font-weight: bold;
                                }
                                .Format-info {
                                  margin-bottom: 20px;
                                  font-size: 16px;
                                  line-height: 1.6;
                                }
                                .Format-table {
                                  width: 100%;
                                  border-collapse: collapse;
                                  margin-bottom: 20px;
                                  font-size: 15px;
                                }
                                .Format-table th,
                                .Format-table td {
                                  border: 1px solid #000;
                                  padding: 8px 10px;
                                  text-align: center;
                                }
                                .total-row {
                                  font-weight: bold;
                                  background-color: #f0f0f0;
                                }
                                .Format-summary {
                                  font-size: 16px;
                                  margin-bottom: 20px;
                                }
                                .Format-summary p {
                                  margin: 4px 0;
                                }
                                .Format-footer {
                                  text-align: center;
                                  font-size: 14px;
                                  color: #333;
                                  margin-top: 30px;
                                }
                                .Format-footer p {
                                  margin: 5px 0;
                                }
                                .Format-footer button {
                                  margin-top: 15px;
                                  padding: 8px 16px;
                                  background-color: #007bff;
                                  color: white;
                                  border: none;
                                  border-radius: 4px;
                                  cursor: pointer;
                                }
                                .Format-footer button:hover {
                                  background-color: #0056b3;
                                }
                                @media print {
                                  .Format-footer button {
                                    display: none;
                                  }
                                  body {
                                    -webkit-print-color-adjust: exact;
                                  }
                                }
                              </style>
                            </head>
                            <body>
                              <div class="Format-container">
                                <div class="Format-header">
                                  <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
                                  <h3>National Institute of Commerce and Technical Training</h3>
                                  <h2 class="Format-title">Marksheet</h2>
                                </div>

                                <div class="Format-info">
                                  <div><strong>Student Name:</strong> ${student.name || 'N/A'}</div>
                                  <div><strong>Enrollment No:</strong> ${cert.certNo || 'CHRETD/23YN04/71583'}</div>
                                  <div><strong>Course Name:</strong> ${student.course || 'DIPLOMA IN YOGA'}</div>
                                  
                                </div>

                                

                                <table class="Format-table">
                                  <thead>
                                    <tr>
                                      <th>Sl.No</th>
                                      <th>Subject</th>
                                      <th>Total Marks</th>
                                      <th>Passing Marks</th>
                                      <th>Obtain Marks</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    ${obtainMarks
                                      .map(
                                        (mark, idx) =>
                                          `<tr>
                                            <td>${idx + 1}</td>
                                            <td>${mark.subject}</td>
                                            <td>${mark.maxMarks}</td>
                                            <td>${mark.passingMarks}</td>
                                            <td>${mark.obtained}</td>
                                          </tr>`
                                      )
                                      .join('')}
                                    <tr class="total-row">
                                      <td colspan="2">Total</td>
                                      <td>${obtainMarks.reduce((sum, mark) => sum + mark.maxMarks, 0)}</td>
                                      <td>${obtainMarks.reduce((sum, mark) => sum + mark.passingMarks, 0)}</td>
                                      <td>${obtainMarks.reduce((sum, mark) => sum + mark.obtained, 0)}</td>
                                    </tr>
                                  </tbody>
                                </table>

                                <div class="Format-summary">
                                  <p><strong>Percentage:</strong> ${(
                                    (obtainMarks.reduce((sum, mark) => sum + mark.obtained, 0) /
                                      obtainMarks.reduce((sum, mark) => sum + mark.maxMarks, 0)) *
                                    100
                                  ).toFixed(2)}%</p>
                                  <p><strong>Result:</strong> ${
                                    obtainMarks.every((mark) => mark.obtained >= mark.passingMarks)
                                      ? 'Pass'
                                      : 'Fail'
                                  }</p>
                                  <p><strong>Grade:</strong> ${
                                    ((obtainMarks.reduce((sum, mark) => sum + mark.obtained, 0) /
                                      obtainMarks.reduce((sum, mark) => sum + mark.maxMarks, 0)) *
                                      100) >= 80
                                      ? 'A'
                                      : ((obtainMarks.reduce((sum, mark) => sum + mark.obtained, 0) /
                                          obtainMarks.reduce((sum, mark) => sum + mark.maxMarks, 0)) *
                                          100) >= 70
                                      ? 'B+'
                                      : 'B'
                                  }</p>
                                  
                                </div>

                                <div class="Format-footer">
                                  <p>🌐 RVTPS</p>
                                  <p>📧 email.com</p>
                                  <p>📞 +91 9999999999</p>
                                  <button onclick="window.print()">Print Format</button>
                                </div>
                              </div>
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
                      placeholder="Enter Enroll. no."
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
                  <td className="stack-buttons">
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