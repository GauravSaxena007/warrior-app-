import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Issuecerti.css';

const Issuecerti = ({ onMarksheetGenerated }) => {
  const [requests, setRequests] = useState([]);
  const [certData, setCertData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [usedNumbers] = useState(new Set());

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, config);
        setCourses(res.data);
        console.log('Courses fetched:', res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        alert('Failed to fetch course data.');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests` , config);
        setRequests(res.data);
        setCertData(res.data.map(() => ({ certNo: '', file: null, marksheet: null, obtainMarks: {} })));
      } catch (err) {
        console.error('Error fetching certificate requests:', err);
        alert('Failed to fetch certificate requests.');
      }
    };
    fetchRequests();
  }, []);

  const generateUniqueEnrollNo = () => {
    try {
      let enrollNo;
      const maxAttempts = 50;
      let attempts = 0;

      do {
        const year = new Date().getFullYear().toString().slice(-2);
        const randomLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
          String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const currentDate = new Date().getDate().toString().padStart(2, '0');
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        enrollNo = `RVTPS/${year}${randomLetters}${currentDate}/${randomDigits}`;
        attempts++;
      } while (usedNumbers.has(enrollNo) && attempts < maxAttempts);

      if (attempts >= maxAttempts) {
        console.error('Could not generate a unique enrollment number after maximum attempts');
        return 'RVTPS/ERROR/00000';
      }

      usedNumbers.add(enrollNo);
      console.log('Generated enrollment number:', enrollNo);
      return enrollNo;
    } catch (error) {
      console.error('Error generating enrollment number:', error);
      return 'RVTPS/ERROR/00000';
    }
  };

  const handleChange = (index, field, value) => {
    const newCertData = [...certData];
    newCertData[index][field] = value;
    setCertData(newCertData);
  };

  const sendData = async (index) => {
    const request = requests[index];
    const certInfo = certData[index];

    if (!request.studentId.name || !request.studentId.mobile || !request.studentId.course) {
      alert('Please ensure all required fields are available: Student Name, Mobile, and Course Name.');
      return;
    }

    if (Object.keys(certInfo.obtainMarks).length === 0) {
      alert('Please enter marks for the student.');
      return;
    }

    const selectedCourse = courses.find((c) => c.title === request.studentId.course);
    let obtainMarksArray = [];

    if (selectedCourse?.semesters?.length > 0) {
      selectedCourse.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          obtainMarksArray.push({
            subject: subj.subject,
            maxMarks: Number(subj.maxMarks),
            passingMarks: Number(subj.passingMarks),
            obtained: Number(certInfo.obtainMarks[subj.subject] || 0),
          });
        });
      });
    }

    const marksheetHTML = generateMarksheetHTML(index);
    const formData = new FormData();
    formData.append('studentName', request.studentId.name);
    formData.append('mobile', request.studentId.mobile);
    formData.append('courseName', request.studentId.course);
    formData.append('certificateNumber', certInfo.certNo);
    formData.append('obtainMarks', JSON.stringify(obtainMarksArray));
    formData.append('marksheetHTML', marksheetHTML);
    if (certInfo.file) formData.append('file', certInfo.file);
    if (certInfo.marksheet) formData.append('marksheet', certInfo.marksheet);

    console.log('FormData contents before send:');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, typeof pair[1] === 'string' ? pair[1].slice(0, 50) + (pair[1].length > 50 ? '...' : '') : pair[1]);
    }
    console.log('Full marksheetHTML:', marksheetHTML);

    if (onMarksheetGenerated) {
      onMarksheetGenerated(marksheetHTML);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/manualcerti`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Backend response:', response.data);

      // Delete the request after sending
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests/${request._id}`, config);
      
      alert('Certificate sent successfully!');
      usedNumbers.delete(certInfo.certNo);
      setRequests(requests.filter((_, i) => i !== index));
      setCertData(certData.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error sending certificate:', error.response?.data || error.message);
      alert('Error sending certificate: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteRow = (index) => {
    const request = requests[index];
    const confirm = window.confirm('Are you sure you want to delete this request?');
    if (!confirm) return;

    try {
      axios.delete(`${import.meta.env.VITE_API_URL}/api/admin-certi/certificateRequests/${request._id}`);
      const newCertData = [...certData];
      if (newCertData[index].certNo) {
        usedNumbers.delete(newCertData[index].certNo);
      }
      setRequests(requests.filter((_, i) => i !== index));
      setCertData(newCertData.filter((_, i) => i !== index));
      alert('Certificate request deleted.');
    } catch (err) {
      console.error('Error deleting certificate request:', err);
      alert('Failed to delete request.');
    }
  };

  const generateMarksheetHTML = (index) => {
    const request = requests[index];
    const certInfo = certData[index];
    const selectedCourse = courses.find((c) => c.title === request.studentId.course);
    const logoUrl = window.location.origin + '/main-logo.png';

    if (!selectedCourse || !selectedCourse.semesters?.length) {
      console.warn('No course or subjects available for:', request.studentId.course);
      return '<p>No subjects available</p>';
    }

    const subjects = selectedCourse.semesters.flatMap((sem) => sem.subjects);
    console.log('Subjects for marksheet:', subjects);

    return `
      <div class="Format-container">
        <div class="Format-section">
          <div class="Format-header">
            <img src="main-logo.png" alt="Institute Logo" class="Format-logo" />
            <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
            <h3>National Institute of Commerce and Technical Training</h3>
            <h2 class="Format-title">Marksheet</h2>
          </div>
          <div class="Format-info">
            <div><strong>Student Name:</strong> ${request.studentId.name || 'N/A'}</div>
            <div><strong>Enrollment No:</strong> ${certInfo.certNo || 'N/A'}</div>
            <div><strong>Course Name:</strong> ${request.studentId.course || 'N/A'}</div>
          </div>
          <table class="Format-table" id="marksheet-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Subject</th>
                <th>Total Marks</th>
                <th>Passing Marks</th>
                <th>Obtain Marks</th>
              </tr>
            </thead>
            <tbody id="marksheet-body">
              ${subjects
                .map((subj, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${subj.subject}</td>
                    <td>${subj.maxMarks}</td>
                    <td>${subj.passingMarks}</td>
                    <td id="mark-${subj.subject}">${certInfo.obtainMarks[subj.subject] || 0}</td>
                  </tr>
                `).join('')}
              <tr class="total-row">
                <td colspan="2">Total</td>
                <td>${subjects.reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0)}</td>
                <td>${subjects.reduce((sum, subj) => sum + Number(subj.passingMarks || 0), 0)}</td>
                <td id="total-marks">${Object.values(certInfo.obtainMarks).reduce((sum, mark) => sum + (Number(mark) || 0), 0)}</td>
              </tr>
            </tbody>
          </table>
          <div class="Format-summary">
            <p><strong>Percentage:</strong> <span id="percentage">${(() => {
              const totalObtained = Object.values(certInfo.obtainMarks).reduce(
                (sum, mark) => sum + (Number(mark) || 0),
                0
              );
              const totalMax = subjects.reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0);
              return totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00';
            })()}%</span></p>
            <p><strong>Result:</strong> <span id="result">${(() => {
              return Object.entries(certInfo.obtainMarks).every(([subj, mark]) => {
                const subject = subjects.find((s) => s.subject === subj);
                return subject && Number(mark) >= subject.passingMarks;
              }) ? 'Pass' : 'Fail';
            })()}</span></p>
            <p><strong>Grade:</strong> <span id="grade">${(() => {
              const totalObtained = Object.values(certInfo.obtainMarks).reduce(
                (sum, mark) => sum + (Number(mark) || 0),
                0
              );
              const totalMax = subjects.reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0);
              const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
              return percentage >= 80
                ? 'A'
                : percentage >= 70
                  ? 'B+'
                  : percentage >= 60
                    ? 'B'
                    : percentage >= 50
                      ? 'C'
                      : percentage >= 40
                        ? 'D'
                        : percentage >= 33
                          ? 'E'
                          : 'F';
            })()}</span></p>
          </div>
          <div class="Format-footer">
            <p>🌐 RVTPS</p>
            <p>📧 RVTPSedu@gmail.com</p>
            <p>📞 +91 90572-75115</p>
            <button id="print-button" onclick="window.print()">Print Marksheet</button>
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    const handleMessage = (e) => {
      const { index, marks } = e.data;
      if (index !== undefined && marks) {
        console.log('Received marks for index', index, ':', marks);
        const newCertData = [...certData];
        newCertData[index].obtainMarks = { ...newCertData[index].obtainMarks, ...marks };
        newCertData[index].certNo = generateUniqueEnrollNo();
        setCertData(newCertData);
        console.log('Updated certData with marks and enrollment number:', newCertData);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [certData]);

  return (
    <div className="container-iss-certi-adm">
      <h4 className="mb-3">Issue Marksheet & Certificate</h4>
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
              <th>Enrollment No.</th>
              <th>Upload Certificate (Optional)</th>
              <th>Upload Marksheet (Optional)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => {
              const student = req?.studentId || {};
              const cert = certData[index] || { certNo: '', file: null, marksheet: null, obtainMarks: {} };
              const course = courses.find((c) => c.title === student.course);
              const semester = course?.semester || 'Not Assigned';

              return (
                <tr key={req._id}>
                  <td>{index + 1}</td>
                  <td>{student.name || 'N/A'}</td>
                  <td>{student.mobile || 'N/A'}</td>
                  <td>{student.course || 'N/A'}</td>
                  <td>{student.franchiseeHead || 'N/A'}</td>
                  <td>{semester}</td>
                  <td>
                    {course?.semesters?.length > 0 ? (
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          const newTab = window.open();
                          console.log('Opening marks editor for course:', student.course);
                          const logoUrl = window.location.origin + '/main-logo.png';
                          const htmlContent = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                              <title>Subjects & Marks</title>
                              <style>
                                .Format-container { max-width: 1200px; margin: 30px auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff; color: #000; display: flex; flex-wrap: wrap; gap: 20px; }
                                .Format-section { flex: 1; min-width: 500px; border: 2px solid #333; border-radius: 8px; padding: 20px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                                .Format-header { text-align: center; margin-bottom: 20px; }
                                .Format-logo { width: 100px; height: auto; margin-bottom: 10px; }
                                .Format-header h2 { margin: 5px 0; font-size: 20px; }
                                .Format-header h3 { margin: 5px 0; font-size: 16px; font-weight: normal; color: #444; }
                                .Format-title { margin-top: 10px; font-size: 22px; text-decoration: underline; font-weight: bold; text-align: center; }
                                .Format-info { margin-bottom: 20px; font-size: 16px; line-height: 1.6; }
                                .Format-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px; }
                                .Format-table th, .Format-table td { border: 1px solid #000; padding: 8px 10px; text-align: center; }
                                .total-row { font-weight: bold; background-color: #e8e8e8; }
                                .Format-summary { font-size: 16px; margin-bottom: 20px; }
                                .Format-summary p { margin: 4px 0; }
                                .Format-footer { text-align: center; font-size: 14px; color: #333; margin-top: 30px; }
                                .Format-footer p { margin: 5px 0; }
                                .Format-footer button { margin: 10px; padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
                                .Format-footer button:hover { background-color: #0056b3; }
                                .editable-table input { width: 80px; padding: 4px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; }
                                @media print { .Format-footer button:not(#print-button), .editable-section { display: none; } .Format-container { display: block; } .Format-section { border: none; box-shadow: none; padding: 0; background-color: #fff; } body { -webkit-print-color-adjust: exact; } }
                              </style>
                            </head>
                            <body>
                              <div class="Format-container">
                                <div class="Format-section">
                                  <div class="Format-header">
                                    <img src="main-logo.png" alt="Institute Logo" style="height: 80px; margin-bottom: 10px;" />
                                    <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
                                    <h3>National Institute of Commerce and Technical Training</h3>
                                    <h2 class="Format-title">Marksheet</h2>
                                  </div>
                                  <div class="Format-info">
                                    <div><strong>Student Name:</strong> ${student.name || 'N/A'}</div>
                                    <div><strong>Enrollment No:</strong> ${cert.certNo || 'N/A'}</div>
                                    <div><strong>Course Name:</strong> ${student.course || 'N/A'}</div>
                                  </div>
                                  <table class="Format-table" id="marksheet-table">
                                    <thead>
                                      <tr>
                                        <th>Sr.No</th>
                                        <th>Subject</th>
                                        <th>Total Marks</th>
                                        <th>Passing Marks</th>
                                        <th>Obtain Marks</th>
                                      </tr>
                                    </thead>
                                    <tbody id="marksheet-body">
                                      ${course.semesters
                                        .flatMap((sem) => sem.subjects)
                                        .map((subj, idx) => `
                                          <tr>
                                            <td>${idx + 1}</td>
                                            <td>${subj.subject}</td>
                                            <td>${subj.maxMarks}</td>
                                            <td>${subj.passingMarks}</td>
                                            <td id="mark-${subj.subject}">${cert.obtainMarks[subj.subject] || 0}</td>
                                          </tr>
                                        `).join('')}
                                      <tr class="total-row">
                                        <td colspan="2">Total</td>
                                        <td>${course.semesters
                                          .flatMap((sem) => sem.subjects)
                                          .reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0)}</td>
                                        <td>${course.semesters
                                          .flatMap((sem) => sem.subjects)
                                          .reduce((sum, subj) => sum + Number(subj.passingMarks || 0), 0)}</td>
                                        <td id="total-marks">${Object.values(cert.obtainMarks)
                                          .reduce((sum, mark) => sum + (Number(mark) || 0), 0)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div class="Format-summary" id="summary">
                                    <p><strong>Percentage:</strong> <span id="percentage">${(() => {
                                      const totalObtained = Object.values(cert.obtainMarks).reduce(
                                        (sum, mark) => sum + (Number(mark) || 0),
                                        0
                                      );
                                      const totalMax = course.semesters
                                        .flatMap((sem) => sem.subjects)
                                        .reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0);
                                      return totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00';
                                    })()}%</span></p>
                                    <p><strong>Result:</strong> <span id="result">${(() => {
                                      return Object.entries(cert.obtainMarks).every(([subj, mark]) => {
                                        const subject = course.semesters
                                          .flatMap((sem) => sem.subjects)
                                          .find((s) => s.subject === subj);
                                        return subject && Number(mark) >= subject.passingMarks;
                                      }) ? 'Pass' : 'Fail';
                                    })()}</span></p>
                                    <p><strong>Grade:</strong> <span id="grade">${(() => {
                                      const totalObtained = Object.values(cert.obtainMarks).reduce(
                                        (sum, mark) => sum + (Number(mark) || 0),
                                        0
                                      );
                                      const totalMax = course.semesters
                                        .flatMap((sem) => sem.subjects)
                                        .reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0);
                                      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
                                      return percentage >= 80
                                        ? 'A'
                                        : percentage >= 70
                                          ? 'B+'
                                          : percentage >= 60
                                            ? 'B'
                                            : percentage >= 50
                                              ? 'C'
                                              : percentage >= 40
                                                ? 'D'
                                                : percentage >= 33
                                                  ? 'E'
                                                  : 'F';
                                    })()}</span></p>
                                  </div>
                                  <div class="Format-footer">
                                    <p>🌐 RVTPS</p>
                                    <p>📧 RVTPSedu@gmail.com</p>
                                    <p>📞 +91 90572-75115</p>
                                    <button id="print-button" onclick="window.print()">Print Marksheet</button>
                                  </div>
                                </div>
                                <div class="Format-section editable-section">
                                  <h2 class="Format-title">Edit Marks</h2>
                                  ${course.semesters
                                    .map(
                                      (sem, i) => `
                                      <div style="margin-bottom: 16px;">
                                        <strong style="color: green;">Semester: ${sem.semester}</strong>
                                        <table class="Format-table editable-table">
                                          <thead>
                                            <tr>
                                              <th>Subject</th>
                                              <th>Max Marks</th>
                                              <th>Passing Marks</th>
                                              <th>Obtain Marks</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            ${sem.subjects
                                              .map(
                                                (subj) => `
                                                <tr>
                                                  <td>${subj.subject}</td>
                                                  <td>${subj.maxMarks}</td>
                                                  <td>${subj.passingMarks}</td>
                                                  <td>
                                                    <input
                                                      type="number"
                                                      min="0"
                                                      max="${subj.maxMarks}"
                                                      value="${cert.obtainMarks[subj.subject] || ''}"
                                                      data-subject="${subj.subject}"
                                                      class="marks-input"
                                                      onkeypress="if(event.key === 'Enter') updateMarks()"
                                                    />
                                                  </td>
                                                </tr>
                                              `
                                              )
                                              .join('')}
                                          </tbody>
                                        </table>
                                      </div>
                                    `
                                    )
                                    .join('')}
                                  <button onclick="updateMarks()" class="Format-footer">Enter</button>
                                </div>
                              </div>
                              <script>
                                let marks = ${JSON.stringify(cert.obtainMarks)};
                                function updateMarks() {
                                  const inputs = document.querySelectorAll('.marks-input');
                                  inputs.forEach(input => {
                                    const subject = input.dataset.subject;
                                    const value = input.value;
                                    if (value !== '') {
                                      marks[subject] = value;
                                    } else {
                                      delete marks[subject];
                                    }
                                  });
                                  console.log('Sending marks to parent:', marks);
                                  window.opener.postMessage({ index: ${index}, marks }, '*');
                                  const subjects = ${JSON.stringify(course.semesters.flatMap((sem) => sem.subjects))};
                                  subjects.forEach(subj => {
                                    document.getElementById('mark-' + subj.subject).textContent = marks[subj.subject] || 0;
                                  });
                                  const totalMarks = Object.values(marks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);
                                  document.getElementById('total-marks').textContent = totalMarks;
                                  const maxMarks = ${course.semesters
                                    .flatMap((sem) => sem.subjects)
                                    .reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0) || 0};
                                  const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(2) : '0.00';
                                  document.getElementById('percentage').textContent = percentage + '%';
                                  const result = subjects.every(subj => {
                                    return !marks[subj.subject] || Number(marks[subj.subject]) >= subj.passingMarks;
                                  }) ? 'Pass' : 'Fail';
                                  document.getElementById('result').textContent = result;
                                  const grade = percentage >= 80 ? 'A' :
                                                percentage >= 70 ? 'B+' :
                                                percentage >= 60 ? 'B' :
                                                percentage >= 50 ? 'C' :
                                                percentage >= 40 ? 'D' :
                                                percentage >= 33 ? 'E' : 'F';
                                  document.getElementById('grade').textContent = grade;
                                }
                              </script>
                            </body>
                            </html>
                          `;
                          newTab.document.write(htmlContent);
                          newTab.document.close();
                        }}
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        View & Edit Subjects & Marks
                      </a>
                    ) : (
                      'No subjects available'
                    )}
                  </td>
                  <td className="max-w-xs break-words whitespace-normal">
                    <div className="break-all whitespace-normal w-full">
                      {cert.certNo || 'Not Generated'}
                    </div>
                  </td>
                  <td>
                    <input
                      type="file"
                      className="form-control-isa"
                      accept=".pdf"
                      onChange={(e) => handleChange(index, 'file', e.target.files[0])}
                    />
                  </td>
                  <td>
                    <input
                      type="file"
                      className="form-control-isa"
                      accept=".pdf"
                      onChange={(e) => handleChange(index, 'marksheet', e.target.files[0])}
                    />
                  </td>
                  <td className="stack-buttons">
                    <button className="btn btn-success btn-sm" onClick={() => sendData(index)}>
                      Send
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteRow(index)}>
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