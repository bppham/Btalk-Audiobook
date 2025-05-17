import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFileAudio,
  faUsers,
  faPeopleRoof,
  faList,
  faPen,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const roles = JSON.parse(localStorage.getItem("roles"));

  const hasRole = (allowedRoles) => {
    return roles.some((role) => allowedRoles.includes(role));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-menu">
          <div className="sidebar-title">Dashboard</div>
          <ul className="sidebar-list">
            <Link to="/" className="link">
              <li className="sidebar-list-item">
                <FontAwesomeIcon className="sidebar-icon" icon={faHouse} /> Home
              </li>
            </Link>
          </ul>
        </div>

        {hasRole(["ROLE_ADMIN", "ROLE_AUDIOBOOK"]) && (
          <div className="sidebar-menu">
            <div className="sidebar-title">Audiobook</div>
            <ul className="sidebar-list">
              <Link to="/categories" className="link">
                <li className="sidebar-list-item">
                  <FontAwesomeIcon className="sidebar-icon" icon={faList} />{" "}
                  Categories
                </li>
              </Link>

              <Link to="/audiobooks" className="link">
                <li className="sidebar-list-item">
                  <FontAwesomeIcon
                    className="sidebar-icon"
                    icon={faFileAudio}
                  />{" "}
                  Audiobook
                </li>
              </Link>

              <Link to="/authors" className="link">
                <li className="sidebar-list-item">
                  <FontAwesomeIcon className="sidebar-icon" icon={faPen} />{" "}
                  Author
                </li>
              </Link>

              <Link to="/voices" className="link">
                <li className="sidebar-list-item">
                  <FontAwesomeIcon
                    className="sidebar-icon"
                    icon={faMicrophone}
                  />{" "}
                  Voice actor
                </li>
              </Link>
            </ul>
          </div>
        )}

        {hasRole(["ROLE_ADMIN"]) && (
          <div className="sidebar-menu">
            <div className="sidebar-title">Clients</div>
            <ul className="sidebar-list">
              <Link to="/users" className="link">
                <li className="sidebar-list-item">
                  <FontAwesomeIcon className="sidebar-icon" icon={faUsers} />{" "}
                  User
                </li>
              </Link>
            </ul>
          </div>
        )}

        {hasRole(["ROLE_ADMIN", "ROLE_EMPLOYEE"]) && (
          <div className="sidebar-menu">
            <div className="sidebar-title">Staff</div>
            <ul className="sidebar-list">
              <Link to="/employees" className="link">
                <li className="sidebar-list-item">
                  <FontAwesomeIcon
                    className="sidebar-icon"
                    icon={faPeopleRoof}
                  />{" "}
                  Employees
                </li>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
