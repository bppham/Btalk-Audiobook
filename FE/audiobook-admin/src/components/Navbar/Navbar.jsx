import React from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to={"/"} className="link">
            <span className="logo">BTalk</span>
          </Link>
        </div>
        <div className="navbar-right">
          <img
            src="https://i.scdn.co/image/ab6761610000e5eb56d2d8d16ddedbf61b1c74f0"
            alt=""
            className="avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
