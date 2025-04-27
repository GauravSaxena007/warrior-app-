import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Dropdowncourses.css"; // Ensure this CSS file is updated if needed

function Dropdowncourses() {
  const [openMain, setOpenMain] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch courses from the API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/courses`)
      .then((res) => {
        setCourses(res.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.map((course) => course.category || "Uncategorized")),
        ];

        // Group courses by category and duration
        const groupedCourses = uniqueCategories.map((category) => {
          const categoryCourses = res.data.filter(
            (course) => (course.category || "Uncategorized") === category
          );

          // Extract unique durations for the category
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
    navigate(`/courses?duration=${duration}`); // Update URL with selected duration
    setOpenMain(false); // Close the dropdown after selection
  };

  return (
    <div className="dropdown-container">
      <button
        onClick={() => setOpenMain(!openMain)}
        className="dropdown-btn"
      >
        COURSES ▾
      </button>

      {openMain && (
        <ul className="dropdown-menu">
          {categories.map((category, index) => (
            <li
              key={index}
              className="dropdown-item"
              onMouseEnter={() => setOpenSubmenu(category.sub ? index : null)}
              onMouseLeave={() => setOpenSubmenu(null)}
            >
              <a href="#" onClick={() => handleCategorySelect(category.name)}>
                {category.name}
              </a>

              {category.sub && openSubmenu === index && (
                <ul className="submenu">
                  {category.sub.map((subCourse, subIndex) => (
                    <li key={subIndex}>
                      <a href="#" onClick={() => handleCategorySelect(subCourse)}>
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
