import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation to read query params
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredDuration, setFilteredDuration] = useState("All");
  const location = useLocation(); // Get the current location object

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  useEffect(() => {
    // Read the `duration` query param from the URL
    const params = new URLSearchParams(location.search);
    const duration = params.get("duration");
    if (duration) {
      setFilteredDuration(duration);
    } else {
      setFilteredDuration("All");
    }
  }, [location.search]); // Trigger the effect when URL changes

  // Normalize duration for comparison
  const normalizeDuration = (value) =>
    value.trim().toLowerCase().replace("months", "").replace("month", "").trim();

  const filteredCourses =
    filteredDuration === "All"
      ? courses
      : courses.filter(
          (course) =>
            normalizeDuration(course.duration) === normalizeDuration(filteredDuration)
        );

  return (
    <section className="courses-section-front container">
      <h2 className="text-center mb-4">Our Courses</h2>

      {/* Filter Tabs */}
      <div className="filter-tabs mb-4 text-center">
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => setFilteredDuration("All")}
        >
          All
        </button>
        {["1 Month", "2 Months", "3 Months", "6 Months", "1 Year"].map((label) => (
          <button
            key={label}
            className="btn btn-outline-primary mx-1"
            onClick={() => setFilteredDuration(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="row">
        {filteredCourses.map((course) => (
          <div className="col-md-6 mb-4" key={course._id}>
            <div className="course-card card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <ul className="course-details">
                  {course.details.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="card-footer course-footer d-flex justify-content-between">
                <span>
                  <strong>Duration:</strong> {course.duration}
                </span>
                <span>
                  <strong>Code:</strong> {course.code}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <a href="/courses" className="btn btn-primary explore-btn">
          Explore Courses
        </a>
      </div>
    </section>
  );
};

export default Courses;
