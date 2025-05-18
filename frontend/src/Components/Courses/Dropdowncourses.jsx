import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dropdowncourses.css";

function Dropdowncourses() {
  const [openMain, setOpenMain] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => {
        setCourses(res.data);

        const uniqueCategories = [
          ...new Set(res.data.map((course) => course.category || "Uncategorized")),
        ];

        const groupedCourses = uniqueCategories.map((category) => {
          const categoryCourses = res.data.filter(
            (course) => (course.category || "Uncategorized") === category
          );

          const durations = [
            ...new Set(categoryCourses.map((course) => course.duration)),
          ].sort((a, b) => {
            const [numA, unitA] = a.split(" ");
            const [numB, unitB] = b.split(" ");
            const monthsA = unitA === "Year" ? parseInt(numA) * 12 : parseInt(numA);
            const monthsB = unitB === "Year" ? parseInt(numB) * 12 : parseInt(numB);
            return monthsA - monthsB;
          });

          return {
            name: category,
            sub: durations.length > 0 ? durations : undefined,
          };
        });

        setCategories(groupedCourses);
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  const handleCategorySelect = (duration) => {
    navigate(`/courses?duration=${duration}`);
    setOpenMain(false);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  return (
    <div className="dropdown-container">
      <button onClick={() => setOpenMain(!openMain)} className="dropdown-btn">
        COURSES ▾
      </button>

      {openMain && (
        <ul className="dropdown-menu">
          {categories.map((category, index) => (
            <li
              key={index}
              className={`dropdown-item ${openSubmenu === index ? "show-submenu" : ""}`}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (category.sub) {
                    toggleSubmenu(index);
                  } else {
                    handleCategorySelect(category.name);
                  }
                }}
              >
                {category.name}
              </a>

              {category.sub && (
                <ul className="submenu">
                  {category.sub.map((subCourse, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategorySelect(subCourse);
                        }}
                      >
                        {subCourse}
                      </a>
                    </li>
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
