import React, { useState } from 'react';
import axios from 'axios';
import './AgreementAdmin.css';

const AgreementAdmin = () => {
  const [welcomeTitle, setWelcomeTitle] = useState("WELCOME DHARMENDRA KUMAR PANHALA!");
  const [agreementTitle, setAgreementTitle] = useState("FRANCHISE AGREEMENT");
  const [content, setContent] = useState([
    "THIS AGREEMENT made on 01-01-2023 BETWEEN RICS EDUCATION PRIVATE LIMITED, a company..."
  ]);
  const [points, setPoints] = useState([
    "The Franchisor hereby grants to the Franchisee..."
  ]);
  const [courses, setCourses] = useState([
    { code: 1, name: "Post Graduate Diploma in Computer Application", duration: "12 Months", royalty: 250 },
    { code: 2, name: "Advance Diploma in Hardware & Networking", duration: "12 Months", royalty: 250 },
    { code: 3, name: "Diploma in Computer Teacher Training", duration: "12 Months", royalty: 250 },
    { code: 4, name: "Advance Diploma in Computer Programming", duration: "6 Months", royalty: 150 },
    { code: 5, name: "Advance Diploma in Information Technology & Designing", duration: "6 Months", royalty: 150 }
  ]);

  // Function to handle changes in course fields
  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
  };

  // Function to add a new course
  const addCourse = () => {
    setCourses([...courses, { code: "", name: "", duration: "", royalty: "" }]);
  };

  // Function to save the agreement by sending a POST request to the backend
  const saveAgreement = async () => {
       const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/agreement/save`, {
        welcomeTitle,
        agreementTitle,
        content,
        points,
        courses
      },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
      alert('Agreement saved successfully!');
      console.log(response.data); // Log the response data for debugging
    } catch (error) {
      alert('Failed to save agreement!');
      console.error(error);
    }
  };

  return (
    <div className="agreement-admin-container">
      <h1>Manage Franchise Agreement</h1>

      <div className="form-group">
        <label>Agreement Title:</label>
        <input
          type="text"
          value={agreementTitle}
          onChange={(e) => setAgreementTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Agreement Paragraphs:</label>
        {content.map((para, index) => (
          <textarea
            key={index}
            value={para}
            onChange={(e) => {
              const updatedContent = [...content];
              updatedContent[index] = e.target.value;
              setContent(updatedContent);
            }}
            rows="10"
          />
        ))}
      </div>

      <div className="form-group">
        <label>Agreement Points:</label>
        {points.map((point, index) => (
          <textarea
            key={index}
            value={point}
            onChange={(e) => {
              const updatedPoints = [...points];
              updatedPoints[index] = e.target.value;
              setPoints(updatedPoints);
            }}
            rows="10"
          />
        ))}
      </div>

      <div className="course-table-admin">
        <h2>Course Details</h2>
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Duration</th>
              <th>Royalty Without Material</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={course.code}
                    onChange={(e) => handleCourseChange(index, 'code', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={course.duration}
                    onChange={(e) => handleCourseChange(index, 'duration', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={course.royalty}
                    onChange={(e) => handleCourseChange(index, 'royalty', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addCourse} className="add-course-btn-aggrement">+ Add New Course</button>
      </div>

      <button onClick={saveAgreement} className="save-btn-agreement">Save Agreement</button>
    </div>
  );
};

export default AgreementAdmin;
