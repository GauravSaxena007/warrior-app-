import { Link } from "react-router-dom";
import { FaUserTie, FaUserShield } from 'react-icons/fa'; // Import icons
import "./Profile.css"; // Import your CSS file

const Profile = () => {
  return (
    <div className="dropdown-container-1">
      <span className="dropdown-label-1">LOGIN</span>
      <ul className="dropdown-menu-1">
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
