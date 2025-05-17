import React from 'react'
import './Library.css'

const Library = () => {
  return (
    <div className='library'>
        <div className="header">

        </div>
        <div className="audiobook-list">
            <div className="item">
                <img src="https://firstnews.vn/upload/products/original/-1729482421.jpg" alt="" />
                <div className="info">
                    <div className="title">
                        Tôi đi học
                    </div>
                    <div className="author">
                        Nguyễn Ngọc Ký
                    </div>
                </div>
            </div>

            <div className="item">
                <img src="https://firstnews.vn/upload/products/original/-1729482421.jpg" alt="" />
                <div className="info">
                    <div className="title">
                        Tôi đi học
                    </div>
                    <div className="author">
                        Nguyễn Ngọc Ký
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Library
