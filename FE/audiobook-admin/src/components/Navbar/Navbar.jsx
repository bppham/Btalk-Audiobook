import React from 'react'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'



const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="navbar-container">
            <div className="navbar-left">
                <span className="logo">BTalk - Admin</span>
            </div>
            <div className="navbar-right">
                <div className="navbar-icons">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="top-icon-bag">2</span>   
                </div>
                <div className="navbar-icons">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span className="top-icon-bag">2</span>   
                </div>
                <div className="navbar-icons">
                    <FontAwesomeIcon icon={faBars} />
                    <span className="top-icon-bag">2</span>   
                </div>
                <img src="https://i.scdn.co/image/ab6761610000e5eb56d2d8d16ddedbf61b1c74f0" alt="" className="avatar" />
            </div>
        </div>
        
    </div>
  )
}

export default Navbar
