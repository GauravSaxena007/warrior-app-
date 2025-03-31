import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaCog, FaFileAlt, FaImages, FaUsers, FaEnvelope } from "react-icons/fa";
import "./Sidebar.css"; 

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-menu">
        <li><Link to="/" className="menu-link"><FaTachometerAlt className="icon" /> Dashboard</Link></li>
        <li><Link to="/settings" className="menu-link"><FaCog className="icon" /> Settings</Link></li>
        <li><Link to="/add-courses" className="menu-link"><FaFileAlt className="icon" /> Add Courses</Link></li>
        <li><Link to="/slider-management" className="menu-link"><FaImages className="icon" /> Slider Management</Link></li>
        <li><Link to="/team-management" className="menu-link"><FaUsers className="icon" /> Team Management</Link></li>
        <li><Link to="/enquiries" className="menu-link"><FaEnvelope className="icon" /> Enquiries</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
