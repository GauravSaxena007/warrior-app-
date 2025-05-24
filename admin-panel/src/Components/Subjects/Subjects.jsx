import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Subjects.css";

const Subjects = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="subjects-container">
      <h2 className="text-center mb-4">Course Subjects</h2>
      {courses.length === 0 ? (
        <p className="text-center">No courses available.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="subjects-card mb-4">
            <h3>{course.title} ({course.code})</h3>
            <p><strong>Category:</strong> {course.category || "Uncategorized"}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Total Semesters:</strong> {course.semester}</p>
            {course.semesters && course.semesters.length > 0 ? (
              <div className="subjects-section">
                <h4>Semesters and Subjects</h4>
                {course.semesters.map((semester) => (
                  <div key={semester.semester} className="subject-block mb-3">
                    <h5>Semester : {semester.semester}</h5>
                    {semester.subjects && semester.subjects.length > 0 ? (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Sr. No</th>
                            <th>Subject</th>
                            <th>Max Marks</th>
                            <th>Passing Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semester.subjects.map((subject, index) => (
                            <tr key={subject._id || index}>
                              <td>{index + 1}</td>
                              <td>{subject.subject}</td>
                              <td>{subject.maxMarks}</td>
                              <td>{subject.passingMarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No subjects available for this semester.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No semesters available for this course.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Subjects;