import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faCircleUser, faCircleLeft } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const Navbar = () => {
  const [keyword, setKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  if (loading) return null;

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
        {!user ? (
          <>
            <Link to="/login" className="link auth-button">
              Đăng nhập
            </Link>
            <Link to="/register" className="link auth-button">
              Đăng ký
            </Link>
          </>
        ) : (
          <div
            className="account"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="avatar"
              className="avatar-img"
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/account" onClick={() => setShowDropdown(false)}>
                  <FontAwesomeIcon icon={faCircleUser} /> Tài khoản
                </Link>
                <div
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                    navigate("/");
                  }}
                >
                  <FontAwesomeIcon icon={faCircleLeft} /> Đăng xuất
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
