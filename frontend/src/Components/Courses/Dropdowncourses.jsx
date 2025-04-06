import { useState } from "react";

function Dropdowncourses() {
  const [openMain, setOpenMain] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const courses = [
    { name: "Computer Courses", sub: ["2 Months Course", "3 Months Course", "6 Months Course", "1 Year Course"] },
    { name: "Optical Courses" },
    { name: "Hardware Courses" },
    { name: "Associate Courses" },
    { name: "Tailoring Courses" },
    { name: "Nursery Courses" },
    { name: "Technical Courses" },
    { name: "Fire & Safety Courses" },
    { name: "Other Courses" },
    { name: "Cinematic Courses" },
    { name: "Food Courses" },
    { name: "Beauty & Hair Courses" },
    { name: "Solar Courses" },
    { name: "Medical Courses" },
    { name: "Agricultural Courses" },
    { name: "Insurance Courses" },
    { name: "Diamond Courses" },
    { name: "Fashion Designing" },
    { name: "Mobile Repairing Courses" },
    { name: "Banking Courses" },
    { name: "Special Courses" }
  ];

  return (
    <div className="dropdown-container">
      <button onClick={() => setOpenMain(!openMain)} className="dropdown-btn">
        COURSES &#9662;
      </button>

      {openMain && (
        <ul className="dropdown-menu">
          {courses.map((course, index) => (
            <li
              key={index}
              className="dropdown-item"
              onMouseEnter={() => setOpenSubmenu(course.sub ? index : null)}
              onMouseLeave={() => setOpenSubmenu(null)}
            >
              <a href="#">{course.name}</a>
              
              {course.sub && openSubmenu === index && (
                <ul className="submenu">
                  {course.sub.map((subCourse, subIndex) => (
                    <li key={subIndex}><a href="#">{subCourse}</a></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdowncourses;
