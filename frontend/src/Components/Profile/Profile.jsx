import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaUserShield } from 'react-icons/fa';
import "./Profile.css";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dropdown
  const toggleDropdown = (e) => {
    e.preventDefault(); // ✅ Prevent page reload
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="dropdown-container-1" ref={dropdownRef}>
      <button className="dropdown-label-1" onClick={toggleDropdown}>
        LOGIN
      </button>
      <ul className={`dropdown-menu-1 ${isOpen ? 'open' : ''}`}>
        <li>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserTie style={{ marginRight: '5px' }} />
            Franchisee Login
          </Link>
        </li>
        <li>
          <Link to="/adminlogin" style={{ display: 'flex', alignItems: 'center' }}>
            <FaUserShield style={{ marginRight: '5px' }} />
            Admin Login
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
