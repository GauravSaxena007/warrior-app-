import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt, FaSlidersH, FaBookOpen, FaImages, FaUsers, FaEnvelopeOpenText,
  FaAddressBook, FaCertificate, FaMoneyCheckAlt, FaTrophy, FaShippingFast,
  FaAward, FaFilm, FaLayerGroup , FaHandshake , FaClipboardList , FaFileAlt ,FaRupeeSign
} from "react-icons/fa";
import "./Sidebar.css"; 

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">RVTPS Admin-Panel</h2>
      <ul className="sidebar-menu">
        <li className="menu-section-title">------ Site Section -----</li>
      <li><Link to="/dashboard" className="menu-link"><FaTachometerAlt className="icon" /> Dashboard</Link></li>
<li><Link to="/settings" className="menu-link"><FaSlidersH className="icon" /> Settings</Link></li>
<li><Link to="/reel" className="menu-link"><FaFilm className="icon" /> Reel</Link></li>
<li><Link to="/slider" className="menu-link"><FaImages className="icon" /> Slider Management</Link></li>
<li><Link to="/enquiry" className="menu-link"><FaEnvelopeOpenText className="icon" /> Enquiries</Link></li>
<li><Link to="/contactuss" className="menu-link"><FaAddressBook className="icon" /> Contact</Link></li>
<li><Link to="/cardsadmin" className="menu-link"><FaLayerGroup className="icon" /> Course Cards</Link></li>
 <li className="menu-section-title">--- Franchisee Section ---</li>
<li><Link to="/addcourses" className="menu-link"><FaBookOpen className="icon" /> Add Courses</Link></li>
<li><Link to="/management" className="menu-link"><FaUsers className="icon" /> Add Franchisee </Link></li>
<li><Link to="/issuecerti" className="menu-link1"><FaCertificate className="icon" /> Issue Marksheet </Link></li>
<li><Link to="/certificatesv3" className="menu-link1"><FaTrophy className="icon" /> Issue Manual Marksheet</Link></li>
<li><Link to="/transac" className="menu-link"><FaRupeeSign className="icon" /> Transaction / Recharge </Link></li>

<li><Link to="/courdetail" className="menu-link"><FaShippingFast className="icon" /> Courier Detail</Link></li>
<li><Link to="/fracer" className="menu-link"><FaAward className="icon" /> Franchisee Certificate</Link></li>
<li><Link to="/agreementadmin" className="menu-link"><FaHandshake className="icon" /> Agreement</Link></li>
<li className="menu-section-title">----- Student Section ----</li>
<li>
  <Link to="/generatecertificate" className="menu-link">
    <FaFileAlt className="icon" /> Generate Certificate
  </Link>
</li>
<li>
  <Link to="/generatemarksheet" className="menu-link">
    <FaClipboardList className="icon" /> Generate Marksheet
  </Link>
</li>
{ /*<li>
  <Link to="/format" className="menu-link">
    <FaClipboardList className="icon" /> Format
  </Link>
</li> */}
<br/>
<br/>
      </ul>
    </aside>
  );
};

export default Sidebar;
