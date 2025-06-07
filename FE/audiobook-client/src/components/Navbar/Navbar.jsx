import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCircleUser } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to={"/"} className="link">
          <span className="logo">BTalk</span>
        </Link>
      </div>
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Tìm kiếm sách của bạn"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>
      <div className="navbar-right">
        <div className="bookmark">
            <FontAwesomeIcon icon={faBookmark} />
        </div>
        <div className="account">
          <Link to={"/account"} className="link">
            <FontAwesomeIcon icon={faCircleUser} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
