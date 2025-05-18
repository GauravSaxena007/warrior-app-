import { useEffect, useState } from "react";
import axios from "axios";
import "./Addcourses.css";

function Addcourses() {
  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    category: "",
    title: "",
    details: "",
    durationNumber: "1",
    durationUnit: "Month",
    code: ""
  });
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  const handleAddCourse = () => {
    const formattedDuration = `${newCourse.durationNumber} ${newCourse.durationUnit}`;
    const detailsArray = newCourse.details
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const newCourseObj = {
      category: newCourse.category,
      title: newCourse.title,
      details: detailsArray,
      duration: formattedDuration,
      code: newCourse.code
    };

    axios.post(`${import.meta.env.VITE_API_URL}/courses`, newCourseObj)
      .then(res => {
        setCourses([...courses, res.data]);
        setNewCourse({
          category: "",
          title: "",
          details: "",
          durationNumber: "1",
          durationUnit: "Month",
          code: ""
        });
        setModalOpen(false);
      })
      .catch(err => {
        console.error("Error saving course:", err);
        alert("Failed to save course. Please try again.");
      });
  };

  const handleDeleteCourse = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/courses/${id}`)
      .then(() => setCourses(courses.filter(course => course._id !== id)))
      .catch(err => console.error("Error deleting course:", err));
  };

  // Get unique categories
  const categories = ["All Categories", ...new Set(courses.map(course => course.category || "Uncategorized"))];

  // Filter courses based on selected category
  const filteredCourses = selectedCategory === "All Categories"
    ? courses
    : courses.filter(course => (course.category || "Uncategorized") === selectedCategory);

  const groupedCourses = filteredCourses.reduce((groups, course) => {
    const category = course.category || "Uncategorized";
    if (!groups[category]) groups[category] = [];
    groups[category].push(course);
    return groups;
  }, {});

  return (
    <div>
      <div className="dropdown-container">
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="dropdown-btn"
        >
          Courses ▾
        </button>

        {openDropdown && (
          <ul className="dropdown-menu">
            {categories.map((category, index) => (
              <li key={index} className="dropdown-item">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(category);
                    setOpenDropdown(false);
                  }}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className="courses-section container my-5">
        <h2 className="text-center mb-4">Course Management</h2>

        <div className="text-center mb-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-lg py-4 px-20 rounded-lg transition duration-300"
          >
            Add New Course
          </button>
        </div>

        <div className="card-wrapper">
          {Object.entries(groupedCourses).map(([categoryName, courseList]) =>
            courseList.map((course) => (
              <div className="card" key={course._id}>
                <div className="card-body">
                  <h5 className="card-title">
                    <span className="category-tag">★ {categoryName}</span> 
                  </h5>
                  <h5 className="card-title">➼ {course.title}</h5>
                  <ul className="course-details">
                    {Array.isArray(course.details) &&
                      course.details.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                  </ul>
                
                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap bg-green">
                <div className="footer-course-content">
    <span className="me-3"><strong>Duration:</strong> {course.duration}</span>
    <span><strong>Code:</strong> {course.code}</span>
  </div>
  <button
                    className="btn btn-danger btn-sm mt-2 mt-md-0"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Delete
                  </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="dialog-overlay" style={{ zIndex: 1050 }}>
            <div className="dialog-content">
              <h2 className="dialog-title">Add Course</h2>

              <input
                type="text"
                placeholder="Course Category"
                value={newCourse.category}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, category: e.target.value })
                }
                className="input-field"
              />

              <input
                type="text"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                className="input-field"
              />

              <textarea
                placeholder="Enter course topics (one per line)"
                value={newCourse.details}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, details: e.target.value })
                }
                className="input-field"
                rows={6}
              />

              <div className="duration-section">
                <select
                  value={newCourse.durationNumber}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, durationNumber: e.target.value })
                  }
                  className="dropdown"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <select
                  value={newCourse.durationUnit}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, durationUnit: e.target.value })
                  }
                  className="dropdown"
                >
                  <option value="Month">Month</option>
                  <option value="Year">Year</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Course Code"
                value={newCourse.code}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, code: e.target.value })
                }
                className="input-field"
              />

              <div className="mt-3 d-flex gap-2 justify-content-end">
                <button className="btn btn-primary" onClick={handleAddCourse}>
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Addcourses;