import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Manualcerti.css';

const Manualcerti = () => {
  const [rows, setRows] = useState([
    { studentName: '', mobile: '', courseName: '', certificateNumber: '', certificateFile: null, marksheetFile: null }
  ]);
  const [courses, setCourses] = useState([]);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleFileChange = (index, field, file) => {
    const newRows = [...rows];
    newRows[index][field] = file;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { studentName: '', mobile: '', courseName: '', certificateNumber: '', certificateFile: null, marksheetFile: null }
    ]);
  };

  const sendData = async (index) => {
    const row = rows[index];
    if (!row.studentName || !row.mobile || !row.courseName || !row.certificateNumber || !row.certificateFile || !row.marksheetFile) {
      alert('Please fill all fields and upload files.');
      return;
    }

    const formData = new FormData();
    formData.append('studentName', row.studentName);
    formData.append('mobile', row.mobile);
    formData.append('courseName', row.courseName);
    formData.append('certificateNumber', row.certificateNumber);
    formData.append('certificateFile', row.certificateFile);
    formData.append('marksheetFile', row.marksheetFile);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/manualcerti`, formData);
      alert('Data sent successfully!');
    } catch (error) {
      console.error(error);
      alert('Error sending certificate');
    }
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  return (
    <div className="manualcerti-container p-3">
      <h2 className="manualcerti-heading text-xl font-bold mb-4">Manual Certificate & Marksheet Upload</h2>
      <table className="manualcerti-table table-auto border border-collapse w-full">
        <thead>
          <tr className="manualcerti-header bg-gray-200">
            <th className="manualcerti-th border px-2 py-1">Sr. No.</th>
            <th className="manualcerti-th border px-2 py-1">Student Name</th>
            <th className="manualcerti-th border px-2 py-1">Mobile</th>
            <th className="manualcerti-th border px-2 py-1">Course Name</th>
            <th className="manualcerti-th border px-2 py-1">Enrollment No.</th>
            <th className="manualcerti-th border px-2 py-1">Upload Certificate</th>
            <th className="manualcerti-th border px-2 py-1">Upload Marksheet</th>
            <th className="manualcerti-th border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="manualcerti-row text-center">
              <td className="manualcerti-td border px-2 py-1">{index + 1}</td>
              <td className="manualcerti-td border px-2 py-1">
                <input type="text" value={row.studentName} onChange={(e) => handleChange(index, 'studentName', e.target.value)} className="manualcerti-input" />
              </td>
              <td className="manualcerti-td border px-2 py-1">
                <input type="text" value={row.mobile} onChange={(e) => handleChange(index, 'mobile', e.target.value)} className="manualcerti-input" />
              </td>
              <td className="manualcerti-td border px-2 py-1">
                <select value={row.courseName} onChange={(e) => handleChange(index, 'courseName', e.target.value)} className="manualcerti-select">
                  <option value="">Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </td>
              <td className="manualcerti-td border px-2 py-1">
                <input type="text" value={row.certificateNumber} onChange={(e) => handleChange(index, 'certificateNumber', e.target.value)} className="manualcerti-input" />
              </td>
              <td className="manualcerti-td border px-2 py-1">
                <input type="file" onChange={(e) => handleFileChange(index, 'certificateFile', e.target.files[0])} className="manualcerti-file" />
              </td>
              <td className="manualcerti-td border px-2 py-1">
                <input type="file" onChange={(e) => handleFileChange(index, 'marksheetFile', e.target.files[0])} className="manualcerti-file" />
              </td>
              <td className="manualcerti-td border px-2 py-1">
                <button className="manualcerti-send bg-green-500 text-white px-2 py-1 mr-1" onClick={() => sendData(index)}>Send</button>
                <button className="manualcerti-delete bg-red-500 text-white px-2 py-1" onClick={() => deleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="manualcerti-add mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={addRow}>Add Row</button>
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
