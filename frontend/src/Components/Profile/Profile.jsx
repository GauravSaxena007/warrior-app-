import { Link } from "react-router-dom";
import "./Profile.css"; // Import your CSS file

const Profile = () => {
  return (
    <div className="dropdown-container-1">
      <span className="dropdown-label-1">LOGIN</span>
      <ul className="dropdown-menu-1">
        <li>
          <Link to="/login">Franchisee Login</Link>
        </li>
        <li>
          <Link to="/settings">Destrict Coordinator Login</Link>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
