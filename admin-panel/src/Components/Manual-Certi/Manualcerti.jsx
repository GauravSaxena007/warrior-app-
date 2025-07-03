import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manualcerti.css';

const Manualcerti = () => {
  const [rows, setRows] = useState([
    {
      studentName: '',
      mobile: '',
      courseName: '',
      certificateNumber: '',
      obtainMarks: {},
    },
  ]);
  const [courses, setCourses] = useState([]);
  const [usedNumbers] = useState(new Set());
  const [logoAvailable, setLogoAvailable] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        console.log('Courses fetched in production:', JSON.stringify(res.data, null, 2));
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err.response?.data || err.message);
        alert('Failed to fetch course data.');
      }
    };

    const checkLogo = async () => {
      try {
        const response = await fetch(`${window.location.origin}/main-logo.png`, { method: 'HEAD' });
        setLogoAvailable(response.ok);
        console.log('Logo availability:', response.ok ? 'Available' : 'Not found');
      } catch (err) {
        console.error('Error checking logo:', err);
        setLogoAvailable(false);
      }
    };

    fetchCourses();
    checkLogo();

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        certificateNumber: row.certificateNumber || generateUniqueEnrollNo(),
      }))
    );
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
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        studentName: '',
        mobile: '',
        courseName: '',
        certificateNumber: generateUniqueEnrollNo(),
        obtainMarks: {},
      },
    ]);
  };

  const sendData = async (index) => {
    const row = rows[index];
    if (!row.studentName || !row.mobile || !row.courseName || !row.certificateNumber) {
      alert('Please fill all required fields: Student Name, Mobile, Course Name, and Enrollment Number.');
      return;
    }

    if (Object.keys(row.obtainMarks).length === 0) {
      alert('Please enter marks via View & Edit Subjects & Marks.');
      return;
    }

    const selectedCourse = courses.find((c) => c.title === row.courseName);
    console.log('Selected course:', JSON.stringify(selectedCourse, null, 2));
    let obtainMarksArray = [];

    if (selectedCourse?.semesters?.length > 0) {
      selectedCourse.semesters.forEach((sem) => {
        sem.subjects.forEach((subj) => {
          obtainMarksArray.push({
            subject: subj.subject,
            maxMarks: subj.maxMarks,
            passingMarks: subj.passingMarks,
            obtained: Number(row.obtainMarks[subj.subject] || 0),
          });
        });
      });
    } else {
      console.warn('No semesters/subjects for course:', row.courseName);
    }

    const formData = new FormData();
    formData.append('studentName', row.studentName);
    formData.append('mobile', row.mobile);
    formData.append('courseName', row.courseName);
    formData.append('certificateNumber', row.certificateNumber);
    formData.append('obtainMarks', JSON.stringify(obtainMarksArray));
    const marksheetHTML = generateMarksheetHTML(index);
    formData.append('marksheetHTML', marksheetHTML);

    console.log('FormData contents before send:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, typeof value === 'string' ? value.slice(0, 100) + (value.length > 100 ? '...' : '') : value);
    }
    console.log('Full obtainMarksArray:', JSON.stringify(obtainMarksArray, null, 2));
    console.log('Full marksheetHTML:', marksheetHTML.slice(0, 200) + (marksheetHTML.length > 200 ? '...' : ''));

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/manualcerti`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Backend response:', JSON.stringify(response.data, null, 2));
      alert('Certificate sent successfully!');
      const newRows = [...rows];
      usedNumbers.delete(row.certificateNumber);
      newRows.splice(index, 1);
      setRows(newRows);
    } catch (error) {
      console.error('Error sending certificate:', error.response?.data || error.message);
      alert('Error sending certificate: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    if (newRows[index].certificateNumber) {
      usedNumbers.delete(newRows[index].certificateNumber);
    }
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const generateMarksheetHTML = (index) => {
    const row = rows[index];
    const selectedCourse = courses.find((c) => c.title === row.courseName);
    const logoUrl = logoAvailable ? `${window.location.origin}/main-logo.png` : 'https://via.placeholder.com/100';

    if (!selectedCourse || !selectedCourse.semesters?.length) {
      console.warn('No course or subjects available for:', row.courseName);
      return `
        <div class="Format-container">
          <div class="Format-section">
            <div class="Format-header">
              <img src="${logoUrl}" alt="Institute Logo" class="Format-logo" />
              <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
              <h3>National Institute of Commerce and Technical Training</h3>
              <h2 class="Format-title">Marksheet</h2>
            </div>
            <div class="Format-info">
              <div><strong>Student Name:</strong> ${row.studentName || 'N/A'}</div>
              <div><strong>Enrollment No:</strong> ${row.certificateNumber || 'N/A'}</div>
              <div><strong>Course Name:</strong> ${row.courseName || 'N/A'}</div>
            </div>
            <p>No subjects available</p>
            <div class="Format-footer">
              <p>🌐 RVTPS</p>
              <p>📧 RVTPSedu@gmail.com</p>
              <p>📞 +91 90572-75115</p>
            </div>
          </div>
        </div>
      `;
    }

    const subjects = selectedCourse.semesters.flatMap((sem) => sem.subjects);
    console.log('Subjects for marksheet:', JSON.stringify(subjects, null, 2));

    return `
      <div class="Format-container">
        <div class="Format-section">
          <div class="Format-header">
            <img src="${logoUrl}" alt="Institute Logo" class="Format-logo" />
            <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
            <h3>National Institute of Commerce and Technical Training</h3>
            <h2 class="Format-title">Marksheet</h2>
          </div>
          <div class="Format-info">
            <div><strong>Student Name:</strong> ${row.studentName || 'N/A'}</div>
            <div><strong>Enrollment No:</strong> ${row.certificateNumber || 'N/A'}</div>
            <div><strong>Course Name:</strong> ${row.courseName || 'N/A'}</div>
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
                    <td id="mark-${subj.subject}">${row.obtainMarks[subj.subject] || 0}</td>
                  </tr>
                `).join('')}
              <tr class="total-row">
                <td colspan="2">Total</td>
                <td>${subjects.reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0)}</td>
                <td>${subjects.reduce((sum, subj) => sum + Number(subj.passingMarks || 0), 0)}</td>
                <td id="total-marks">${Object.values(row.obtainMarks).reduce((sum, mark) => sum + (Number(mark) || 0), 0)}</td>
              </tr>
            </tbody>
          </table>
          <div class="Format-summary">
            <p><strong>Percentage:</strong> <span id="percentage">${(() => {
              const totalObtained = Object.values(row.obtainMarks).reduce(
                (sum, mark) => sum + (Number(mark) || 0),
                0
              );
              const totalMax = subjects.reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0);
              return totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00';
            })()}%</span></p>
            <p><strong>Result:</strong> <span id="result">${(() => {
              return Object.entries(row.obtainMarks).every(([subj, mark]) => {
                const subject = subjects.find((s) => s.subject === subj);
                return subject && Number(mark) >= subject.passingMarks;
              }) ? 'Pass' : 'Fail';
            })()}</span></p>
            <p><strong>Grade:</strong> <span id="grade">${(() => {
              const totalObtained = Object.values(row.obtainMarks).reduce(
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
        console.log('Received marks for index', index, ':', JSON.stringify(marks, null, 2));
        const newRows = [...rows];
        newRows[index].obtainMarks = { ...newRows[index].obtainMarks, ...marks };
        setRows(newRows);
        console.log('Updated rows after marks:', JSON.stringify(newRows, null, 2));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [rows]);

  return (
    <div className="manualcerti-container p-3">
      <h2 className="manualcerti-heading text-xl font-bold mb-4">Manual Certificate & Marksheet Upload</h2>
      {!logoAvailable && (
        <p className="text-red-500">Warning: Logo not found at {window.location.origin}/main-logo.png. Using placeholder.</p>
      )}
      <table className="manualcerti-table table-auto border border-collapse w-full">
        <thead>
          <tr className="manualcerti-header bg-gray-200">
            <th className="manualcerti-th border px-2 py-1">Sr. No.</th>
            <th className="manualcerti-th border px-2 py-1">Student Name</th>
            <th className="manualcerti-th border px-2 py-1">Mobile</th>
            <th className="manualcerti-th border px-2 py-1">Course Name</th>
            <th className="manualcerti-th border px-2 py-1">Subjects & Marks</th>
            <th className="manualcerti-th enrollment-col border">Enrollment No.</th>
            <th className="manualcerti-th border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const selectedCourse = courses.find((c) => c.title === row.courseName);
            return (
              <tr key={index} className="manualcerti-row text-center">
                <td className="manualcerti-td border px-2 py-1">{index + 1}</td>
                <td className="manualcerti-td border px-2 py-1">
                  <input
                    type="text"
                    value={row.studentName}
                    onChange={(e) => handleChange(index, 'studentName', e.target.value)}
                    className="manualcerti-input w-full"
                  />
                </td>
                <td className="manualcerti-td border px-2 py-1">
                  <input
                    type="text"
                    value={row.mobile}
                    onChange={(e) => handleChange(index, 'mobile', e.target.value)}
                    className="manualcerti-input w-full"
                  />
                </td>
                <td className="manualcerti-td border px-2 py-1">
                  <select
                    value={row.courseName}
                    onChange={(e) => handleChange(index, 'courseName', e.target.value)}
                    className="manualcerti-select w-full"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.title}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="manualcerti-td border px-2 py-1">
                  {selectedCourse?.semesters?.length > 0 ? (
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Opening marks editor for course:', row.courseName);
                        const newTab = window.open('', '_blank');
                        if (!newTab) {
                          alert('Failed to open marks editor. Please allow pop-ups.');
                          return;
                        }
                        const logoUrl = logoAvailable ? `${window.location.origin}/main-logo.png` : 'https://via.placeholder.com/100';
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
                                  <img src="${logoUrl}" alt="Institute Logo" style="height: 80px; margin-bottom: 10px;" />
                                  <h2>राष्ट्रीय वाणिज्य एवं तकनीकी प्रशिक्षण संस्थान</h2>
                                  <h3>National Institute of Commerce and Technical Training</h3>
                                  <h2 class="Format-title">Marksheet</h2>
                                </div>
                                <div class="Format-info">
                                  <div><strong>Student Name:</strong> ${row.studentName || 'N/A'}</div>
                                  <div><strong>Enrollment No:</strong> ${row.certificateNumber || 'N/A'}</div>
                                  <div><strong>Course Name:</strong> ${row.courseName || 'N/A'}</div>
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
                                    ${selectedCourse.semesters
                                      .flatMap((sem) => sem.subjects)
                                      .map((subj, idx) => `
                                        <tr>
                                          <td>${idx + 1}</td>
                                          <td>${subj.subject}</td>
                                          <td>${subj.maxMarks}</td>
                                          <td>${subj.passingMarks}</td>
                                          <td id="mark-${subj.subject}">${row.obtainMarks[subj.subject] || 0}</td>
                                        </tr>
                                      `).join('')}
                                    <tr class="total-row">
                                      <td colspan="2">Total</td>
                                      <td>${selectedCourse.semesters
                                        .flatMap((sem) => sem.subjects)
                                        .reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0)}</td>
                                      <td>${selectedCourse.semesters
                                        .flatMap((sem) => sem.subjects)
                                        .reduce((sum, subj) => sum + Number(subj.passingMarks || 0), 0)}</td>
                                      <td id="total-marks">${Object.values(row.obtainMarks)
                                        .reduce((sum, mark) => sum + (Number(mark) || 0), 0)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div class="Format-summary" id="summary">
                                  <p><strong>Percentage:</strong> <span id="percentage">${(() => {
                                    const totalObtained = Object.values(row.obtainMarks).reduce(
                                      (sum, mark) => sum + (Number(mark) || 0),
                                      0
                                    );
                                    const totalMax = selectedCourse.semesters
                                      .flatMap((sem) => sem.subjects)
                                      .reduce((sum, subj) => sum + Number(subj.maxMarks || 0), 0);
                                    return totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00';
                                  })()}%</span></p>
                                  <p><strong>Result:</strong> <span id="result">${(() => {
                                    return Object.entries(row.obtainMarks).every(([subj, mark]) => {
                                      const subject = selectedCourse.semesters
                                        .flatMap((sem) => sem.subjects)
                                        .find((s) => s.subject === subj);
                                      return subject && Number(mark) >= subject.passingMarks;
                                    }) ? 'Pass' : 'Fail';
                                  })()}</span></p>
                                  <p><strong>Grade:</strong> <span id="grade">${(() => {
                                    const totalObtained = Object.values(row.obtainMarks).reduce(
                                      (sum, mark) => sum + (Number(mark) || 0),
                                      0
                                    );
                                    const totalMax = selectedCourse.semesters
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
                                ${selectedCourse.semesters
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
                                                    value="${row.obtainMarks[subj.subject] || ''}"
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
                              let marks = ${JSON.stringify(row.obtainMarks)};
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
                                try {
                                  window.opener.postMessage({ index: ${index}, marks }, '*');
                                } catch (e) {
                                  console.error('Error sending postMessage:', e);
                                  alert('Failed to send marks to main window. Please close this tab and try again.');
                                }
                                const subjects = ${JSON.stringify(selectedCourse.semesters.flatMap((sem) => sem.subjects))};
                                subjects.forEach(subj => {
                                  document.getElementById('mark-' + subj.subject).textContent = marks[subj.subject] || 0;
                                });
                                const totalMarks = Object.values(marks).reduce((sum, mark) => sum + (Number(mark) || 0), 0);
                                document.getElementById('total-marks').textContent = totalMarks;
                                const maxMarks = ${selectedCourse.semesters
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
                <td className="manualcerti-td border px-2 py-1 max-w-xs break-words whitespace-normal">
                  <div className="break-all whitespace-normal w-full">
                    {row.certificateNumber}
                  </div>
                </td>
                <td className="manualcerti-td border px-2 py-1">
                  <button className="manualcerti-send bg-green-500 text-white px-2 py-1 mr-1" onClick={() => sendData(index)}>
                    Send
                  </button>
                  <button className="manualcerti-delete bg-red-500 text-white px-2 py-1" onClick={() => deleteRow(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="manualcerti-add mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={addRow}>
        Add Row
      </button>
      <button
        className="manual-certi-btn-send bg-green-500 text-white px-4 py-2 mt-4 ml-2 rounded"
        onClick={() => rows.forEach((_, idx) => sendData(idx))}
      >
        Send All Rows
      </button>
    </div>
  );
};

export default Manualcerti;