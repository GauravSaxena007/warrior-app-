import { useState } from "react";
import "./Addcourses.css";

function Addcourses() {
  const [courses, setCourses] = useState([
    { title: "Computer Courses", duration: "6 Months", description: "Comprehensive computer training", code: "CC101" },
    { title: "Computer Courses", duration: "3 Months", description: "Basic computing skills", code: "CC102" },
    { title: "Optical Courses", duration: "3 Months", description: "Basic optical training", code: "OC202" },
    { title: "Hardware Courses", duration: "1 Year", description: "Hardware maintenance and repair", code: "HC303" }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    durationNumber: "1",
    durationUnit: "Month",
    description: "",
    code: ""
  });

  const handleAddCourse = () => {
    const formattedDuration = `${newCourse.durationNumber} ${newCourse.durationUnit}`;
    setCourses([...courses, { ...newCourse, duration: formattedDuration }]);
    setNewCourse({ title: "", durationNumber: "1", durationUnit: "Month", description: "", code: "" });
    setModalOpen(false);
  };

  const handleDeleteCourse = (courseCode) => {
    setCourses(courses.filter(course => course.code !== courseCode));
  };

  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.title]) {
      acc[course.title] = [];
    }
    acc[course.title].push(course);
    return acc;
  }, {});

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Panel - Course Management</h1>
      <button onClick={() => setModalOpen(true)} className="add-button">Add Course</button>

      <div className="card">
        <div className="card-content">
          <ul className="course-list">
            {Object.keys(groupedCourses).map((title, index) => (
              <li key={index} className="course-group">
                <strong>&#8226; {title}</strong>
                <ul>
                  {groupedCourses[title].map((course, subIndex) => (
                    <li key={`${index}-${subIndex}`} className="course-item">
                      <span><strong>Duration:</strong> {course.duration}</span>
                      <span><strong>Description:</strong> {course.description}</span>
                      <span><strong>Course Code:</strong> {course.code}</span>
                      <button onClick={() => handleDeleteCourse(course.code)} className="delete-button">Delete</button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2 className="dialog-title">Add Course</h2>
            <input 
              type="text" 
              placeholder="Course Title" 
              value={newCourse.title} 
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} 
              className="input-field"
            />
            <div className="duration-section">
              <select
                value={newCourse.durationNumber}
                onChange={(e) => setNewCourse({ ...newCourse, durationNumber: e.target.value })}
                className="dropdown"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <select
                value={newCourse.durationUnit}
                onChange={(e) => setNewCourse({ ...newCourse, durationUnit: e.target.value })}
                className="dropdown"
              >
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </div>
            <input 
              type="text" 
              placeholder="Course Description" 
              value={newCourse.description} 
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
              className="input-field"
            />
            <input 
              type="text" 
              placeholder="Course Code" 
              value={newCourse.code} 
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} 
              className="input-field"
            />
            <button onClick={handleAddCourse} className="save-button">Save</button>
            <button onClick={() => setModalOpen(false)} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addcourses;
