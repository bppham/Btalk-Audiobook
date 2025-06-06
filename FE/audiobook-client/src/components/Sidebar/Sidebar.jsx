import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHeadphones,
  faHome,
  faList,
  faRankingStar,
  faChevronUp,
  faChevronDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { listCategories } from "../../services/CategoryService";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      setCategories(response.data.result);
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
      toast.error("Failed to load audiobooks!");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="sidebar">
      <div className={`sidebar-container ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="sidebar-top">
          <Link to="/" className="link" onClick={closeMobileMenu}>
            <div className="sidebar-item">
              <FontAwesomeIcon icon={faHome} />
              <h2>Trang chủ</h2>
            </div>
          </Link>
          <Link to="/library" className="link" onClick={closeMobileMenu}>
            <div className="sidebar-item">
              <FontAwesomeIcon icon={faBook} />
              <h2>Thư viện</h2>
            </div>
          </Link>
          <Link to="/history" className="link" onClick={closeMobileMenu}>
            <div className="sidebar-item">
              <FontAwesomeIcon icon={faHeadphones} />
              <h2>Đã nghe</h2>
            </div>
          </Link>
          <Link to="/ranking" className="link" onClick={closeMobileMenu}>
            <div className="sidebar-item">
              <FontAwesomeIcon icon={faRankingStar} />
              <h2>Xếp hạng</h2>
            </div>
          </Link>
          <div
            className="sidebar-item category"
            onClick={() => setShowCategories(!showCategories)}
          >
            <FontAwesomeIcon icon={faList} />
            <h2>Danh mục</h2>
            <FontAwesomeIcon
              icon={showCategories ? faChevronUp : faChevronDown}
              className="arrow-icon"
            />
          </div>
          {showCategories && (
            <div className="category-list">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-item"
                  onClick={() => {
                    closeMobileMenu();
                    navigate(
                      `/category/${category.id}?name=${encodeURIComponent(
                        category.name
                      )}`
                    );
                  }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      />
      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </div>
  );
};

export default Sidebar;
