import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate("/auth/login");
  //   }
  // }, [loading, user, navigate]);
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to={"/"} className="link">
            <span className="logo">BTalk</span>
          </Link>
        </div>
        <div
          className="navbar-right"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img src={user.avatar} alt="" className="avatar" />
          {showDropdown && (
            <div className="dropdown-menu">
              <Link
                to="/employee/account"
                onClick={() => setShowDropdown(false)}
              >
                <FontAwesomeIcon icon={faCircleUser} /> Account
              </Link>
              <div
                onClick={async () => {
                  await logout();
                  setShowDropdown(false);
                  navigate("/");
                }}
              >
                <FontAwesomeIcon icon={faCircleLeft} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
