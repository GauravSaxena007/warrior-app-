import React from "react";
import { Link } from "react-router-dom";
import { FaPhone } from "react-icons/fa"; // Add at top
import { FaTachometerAlt, FaCog, FaFileAlt, FaImages, FaUsers, FaEnvelope } from "react-icons/fa";
import "./Sidebar.css"; 

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        <li><Link to="/" className="menu-link"><FaTachometerAlt className="icon" /> Dashboard</Link></li>
        <li><Link to="/settings" className="menu-link"><FaCog className="icon" /> Settings</Link></li>
        <li><Link to="/addcourses" className="menu-link"><FaFileAlt className="icon" /> Add Courses</Link></li>
        <li><Link to="/slider" className="menu-link"><FaImages className="icon" /> Slider Management</Link></li>
        <li><Link to="/team-management" className="menu-link"><FaUsers className="icon" /> Team Management</Link></li>
        <li><Link to="/enquiry" className="menu-link"><FaEnvelope className="icon" /> Enquiries</Link></li>
        <li><Link to="/contactuss" className="menu-link"><FaPhone className="icon" /> Contact</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
