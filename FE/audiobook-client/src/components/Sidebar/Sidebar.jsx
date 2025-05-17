import React from 'react'
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHeadphones, faHome, faList, faRankingStar, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom"
import './Sidebar.css'
const Sidebar = () => {
    const [showCategories, setShowCategories] = useState(false);
    const categories = ["Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý","Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý","Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý","Tiểu thuyết", "Truyện tranh", "Kinh tế", "Lập trình", "Tâm lý1"];
  return (
    <div className='sidebar'>
        <div className="sidebar-container">
            <div className="sidebar-top">
                <Link to="/" className='link'>
                    <div className="sidebar-item">
                        <FontAwesomeIcon icon={faHome} />
                        <h2>Trang chủ</h2>
                    </div>
                </Link>
                <div className="sidebar-item">
                    <FontAwesomeIcon icon={faBook} />
                    <h2>Thư viện</h2>
                </div>
                <div className="sidebar-item">
                    <FontAwesomeIcon icon={faHeadphones} />
                    <h2>Đang nghe</h2>
                </div>
                <div className="sidebar-item">
                    <FontAwesomeIcon icon={faRankingStar} />
                    <h2>Xếp hạng</h2>
                </div>
                <div className="sidebar-item category" onClick={() => setShowCategories(!showCategories)}>
                    <FontAwesomeIcon icon={faList} />
                    <h2>Danh mục</h2>
                    <FontAwesomeIcon icon={showCategories ? faChevronUp : faChevronDown} className="arrow-icon"/>
                </div>
                {/* Hiển thị danh mục khi click */}
                {showCategories && (
                    <div className="category-list">
                        {categories.map((category, index) => (
                            <div key={index} className="category-item">
                                {category}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <br />
            <div className="sidebar-bottom">
                
            </div>
        </div>
    </div>
  )
}

export default Sidebar
