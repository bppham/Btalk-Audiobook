import React from 'react'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHeadphones, faHome, faList, faRankingStar, faChevronUp, faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom"
import './Sidebar.css'

const Sidebar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const categories = ["Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý","Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý","Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý","Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý1"];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className='sidebar'>
            <div className={`sidebar-container ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="sidebar-top">
                    <Link to="/" className='link' onClick={closeMobileMenu}>
                        <div className="sidebar-item">
                            <FontAwesomeIcon icon={faHome} />
                            <h2>Trang chủ</h2>
                        </div>
                    </Link>
                    <div className="sidebar-item" onClick={closeMobileMenu}>
                        <FontAwesomeIcon icon={faBook} />
                        <h2>Thư viện</h2>
                    </div>
                    <div className="sidebar-item" onClick={closeMobileMenu}>
                        <FontAwesomeIcon icon={faHeadphones} />
                        <h2>Đang nghe</h2>
                    </div>
                    <div className="sidebar-item" onClick={closeMobileMenu}>
                        <FontAwesomeIcon icon={faRankingStar} />
                        <h2>Xếp hạng</h2>
                    </div>
                    <div className="sidebar-item category" onClick={() => setShowCategories(!showCategories)}>
                        <FontAwesomeIcon icon={faList} />
                        <h2>Danh mục</h2>
                        <FontAwesomeIcon icon={showCategories ? faChevronUp : faChevronDown} className="arrow-icon"/>
                    </div>
                    {showCategories && (
                        <div className="category-list">
                            {categories.map((category, index) => (
                                <div key={index} className="category-item" onClick={closeMobileMenu}>
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div 
                className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
                onClick={closeMobileMenu}
            />
            <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={faBars} />
            </button>
        </div>
    )
}

export default Sidebar
