import React from "react";
import "./Courses.css";

export const courses = [
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
];

const Courses = () => {
  return (
    <section className="courses-section container my-5">
      <h2 className="text-center mb-4">Our Courses</h2>
      <div className="row">
        {courses.map((course) => (
          <div className="col-md-6 mb-4" key={course.id}>
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
                <span><strong>Duration:</strong> {course.duration}</span>
                <span><strong>Code:</strong> {course.code}</span>
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
