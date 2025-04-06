import { useState } from "react";
import "./Addcourses.css"; // Reuse CSS for both display and modal styling

function Addcourses() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Advanced Diploma in Hardware & Networking",
      details: [
        "Basic Electronics",
        "Micro Processor",
        "Mother Board",
        "Diagnostics Software Used in Computer",
        "Peripherals (HDD, RAM, CD-ROM, FDD etc)",
        "Introduction & Installation of OS & Software",
        "Digital Electronics & B Electronic Circuit",
        "Different Cards Used in Computer",
        "Introduction to SMB Techniques & Antivirus",
        "Power Supply (SMPS)",
        "Assembling & Trouble Shooting of PC",
        "Introduction to Networking",
        "Making new Internet Connection",
        "Network Operating System"
      ],
      duration: "1 year",
      code: "003"
    },
    {
      id: 2,
      title: "Diploma in Computer Application",
      details: [
        "Computer Fundamentals",
        "Windows",
        "Microsoft Office (word, excel, power point)",
        "Accounting Package",
        "Basic concept of Hardware Maintenance",
        "C Programming",
        "D.T.P. (Page Maker, Corel Draw) (Multiple languages)",
        "Internet (Outlook Express)"
      ],
      duration: "6 Months",
      code: "005"
    },
    {
      id: 3,
      title: "Advance Diploma in Computer Programming & Designing",
      details: [
        "Computer Fundamentals",
        "Windows",
        "Microsoft Office (word, excel, power point)",
        "D.T.P. (Page Maker, Corel Draw, Photoshop)",
        "C Programming / Visual Basic / C++",
        "Basic concept of Hardware Maintenance",
        "Project work",
        "Introduction to Internet & Multimedia"
      ],
      duration: "6 Months",
      code: "006"
    },
    {
      id: 4,
      title: "Advance Diploma in Information Technology",
      details: [
        "Computer Fundamentals",
        "Windows",
        "Microsoft Office",
        "D.T.P Course",
        "Accounting Package",
        "Basic concept of Hardware Maintenance",
        "Introduction to Internet & Multimedia",
        "Seminar",
        "Project"
      ],
      duration: "6 Months",
      code: "007"
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    details: "",
    durationNumber: "1",
    durationUnit: "Month",
    code: ""
  });

  const handleAddCourse = () => {
    const formattedDuration = `${newCourse.durationNumber} ${newCourse.durationUnit}`;
    const detailsArray = newCourse.details
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const newCourseObj = {
      id: Date.now(),
      title: newCourse.title,
      details: detailsArray,
      duration: formattedDuration,
      code: newCourse.code
    };

    setCourses([...courses, newCourseObj]);
    setNewCourse({
      title: "",
      details: "",
      durationNumber: "1",
      durationUnit: "Month",
      code: ""
    });
    setModalOpen(false);
  };

  const handleDeleteCourse = (code) => {
    setCourses(courses.filter((course) => course.code !== code));
  };

  return (
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
<br/>

      <div className="card-wrapper">
  {courses.map((course) => (
    <div className="card" key={course.id}>
      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        <ul className="course-details">
          {course.details.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <span className="me-3"><strong>Duration:</strong> {course.duration}</span>
          <span><strong>Code:</strong> {course.code}</span>
        </div>
        <button
          className="btn btn-danger btn-sm mt-2 mt-md-0"
          onClick={() => handleDeleteCourse(course.code)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>


      {modalOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2 className="dialog-title">Add Course</h2>
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
      )}
    </section>
  );
}

export default Addcourses;
