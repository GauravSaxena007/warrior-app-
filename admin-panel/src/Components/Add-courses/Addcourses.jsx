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
    code: "",
    semester: "1",
    semesters: [{ semester: 1, subjects: [{ id: Date.now(), subject: "", maxMarks: "", passingMarks: "" }] }],
  });
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error("Error fetching courses:", err));
  }, []);

  useEffect(() => {
    const semesterCount = parseInt(newCourse.semester) || 1;
    setNewCourse(prev => {
      const currentSemesters = prev.semesters || [];
      const newSemesters = Array.from({ length: semesterCount }, (_, i) => {
        const existingSemester = currentSemesters.find(s => s.semester === i + 1);
        return existingSemester || { semester: i + 1, subjects: [{ id: Date.now() + i, subject: "", maxMarks: "", passingMarks: "" }] };
      });
      return { ...prev, semesters: newSemesters };
    });
  }, [newCourse.semester]);

  const handleAddCourse = () => {
    const formattedDuration = `${newCourse.durationNumber} ${newCourse.durationUnit}`;
    const detailsArray = newCourse.details
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    // Filter out subjects with empty fields
    const filteredSemesters = newCourse.semesters
      .map(sem => ({
        ...sem,
        subjects: sem.subjects.filter(
          subject => subject.subject.trim() !== "" &&
            subject.maxMarks.trim() !== "" &&
            subject.passingMarks.trim() !== ""
        )
      }))
      .filter(sem => sem.subjects.length > 0);

    // Validate required fields
    if (!newCourse.category || !newCourse.title || !newCourse.code || filteredSemesters.length === 0) {
      alert("Please fill in all required fields: Category, Title, Code, and at least one valid subject.");
      return;
    }

    const newCourseObj = {
      category: newCourse.category,
      title: newCourse.title,
      details: detailsArray,
      duration: formattedDuration,
      code: newCourse.code,
      semester: newCourse.semester,
      semesters: filteredSemesters,
    };

    console.log("Saving course:", JSON.stringify(newCourseObj, null, 2));

    axios.post(`${import.meta.env.VITE_API_URL}/api/courses`, newCourseObj)
      .then(res => {
        console.log("Course saved successfully:", res.data);
        setCourses([...courses, res.data]);
        setNewCourse({
          category: "",
          title: "",
          details: "",
          durationNumber: "1",
          durationUnit: "Month",
          code: "",
          semester: "1",
          semesters: [{ semester: 1, subjects: [{ id: Date.now(), subject: "", maxMarks: "", passingMarks: "" }] }],
        });
        setModalOpen(false);
      })
      .catch(err => {
        console.error("Error saving course:", {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          } : null
        });
        alert("Failed to save course. Please try again.");
      });
  };

  const handleDeleteCourse = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${id}`)
      .then(() => setCourses(courses.filter(course => course._id !== id)))
      .catch(err => console.error("Error deleting course:", err));
  };

  const handleAddSubject = (semesterNum) => {
    setNewCourse(prev => ({
      ...prev,
      semesters: prev.semesters.map(sem =>
        sem.semester === semesterNum
          ? { ...sem, subjects: [...sem.subjects, { id: Date.now(), subject: "", maxMarks: "", passingMarks: "" }] }
          : sem
      ),
    }));
  };

  const handleDeleteSubject = (semesterNum, id) => {
    setNewCourse(prev => ({
      ...prev,
      semesters: prev.semesters.map(sem =>
        sem.semester === semesterNum
          ? { ...sem, subjects: sem.subjects.filter(subject => subject.id !== id) }
          : sem
      ),
    }));
  };

  const handleSubjectChange = (semesterNum, id, field, value) => {
    setNewCourse(prev => ({
      ...prev,
      semesters: prev.semesters.map(sem =>
        sem.semester === semesterNum
          ? {
            ...sem,
            subjects: sem.subjects.map(subject =>
              subject.id === id ? { ...subject, [field]: value } : subject
            ),
          }
          : sem
      ),
    }));
  };

  const handleSaveSubject = (semesterNum, subjectId) => {
    const semester = newCourse.semesters.find((sem) => sem.semester === semesterNum);
    const subject = semester.subjects.find((sub) => sub.id === subjectId);
    if (!subject.subject || !subject.maxMarks || !subject.passingMarks) {
      alert("Please fill in all subject fields before saving.");
      return;
    }
    console.log(`Subject ${subject.subject} in Semester ${semesterNum} validated successfully.`);
    // Optionally, add visual feedback (e.g., highlight the row or show a success message)
  };

  const categories = ["All Categories", ...new Set(courses.map(course => course.category || "Uncategorized"))];

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
      <button
          onClick={() => {
            window.location.href = "/dashboard/subjects";
          }}
          className="sem-sub"
        >
          Semester & Subjects 
        </button>

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
                      <span className="me-3"><strong>Duration:</strong> {course.duration}</span><br />
                      <span><strong>Code:</strong> {course.code}</span><br />
                      <span><strong>Semester:</strong> {course.semester}</span><br />
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

        {modalOpen && (
          <div className="dialog-overlay" style={{ zIndex: 1050 }}>
            <div className="dialog-content" style={{ maxWidth: "800px" }}>
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
                <h5>Duration :</h5>
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

              <div className="semester-section mt-3">
                <label htmlFor="semesterSelect" style={{ marginRight: "8px" }}>
               <h5>Semester:</h5>
                </label>
                <select
                  id="semesterSelect"
                  value={newCourse.semester}
                  onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                  className="dropdown"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="subjects-section mt-3">
                {newCourse.semesters.map((semester) => (
                  <div key={semester.semester} className="mb-4">
                    <h4>Semester : {semester.semester} Subjects</h4>
                    <table className="table-table-bordered-subject">
                      <thead>
                        <tr>
                          <th>Sr. No</th>
                          <th>Subject</th>
                          <th>Max Marks</th>
                          <th>Passing Marks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.subjects.map((subject, index) => (
                          <tr key={subject.id}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                type="text"
                                value={subject.subject}
                                onChange={(e) => handleSubjectChange(semester.semester, subject.id, "subject", e.target.value)}
                                className="input-field"
                                placeholder="Enter subject"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={subject.maxMarks}
                                onChange={(e) => handleSubjectChange(semester.semester, subject.id, "maxMarks", e.target.value)}
                                className="input-field"
                                placeholder="Max marks"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={subject.passingMarks}
                                onChange={(e) => handleSubjectChange(semester.semester, subject.id, "passingMarks", e.target.value)}
                                className="input-field"
                                placeholder="Passing marks"
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteSubject(semester.semester, subject.id)}
                                disabled={semester.subjects.length === 1}
                              >
                                Delete
                              </button>
                              
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleAddSubject(semester.semester)}
                    >
                      Add Subject
                    </button>
                  </div>
                ))}
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