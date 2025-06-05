import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import './Navbar.css'
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="navbar-left">
            <Link to={'/'} className='link'>
                <span className="logo">
                    BTalk
                </span>
            </Link>
            
        </div>
        <div className="navbar-center">
            <input type="text" placeholder='Tìm kiếm sách của bạn'/>
            <button>Tìm kiếm</button>
        </div>
        <div className="navbar-right">
            <div className="account">
                <FontAwesomeIcon icon={faCircleUser} />
            </div>
        </div>
    </div>
  )
}

export default Navbar
