import React, { useEffect, useState } from 'react'
import './Home.css'
import { listAudioBook } from '../../services/AudiobookService';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();
    // Show list audiobook
    const [audiobooks, setAudiobooks] = useState([]);

    const fetchAudioBooks = async () => {
        try {
            const response = await listAudioBook();
            setAudiobooks(response.data.result);
        } catch (error) {
            console.error("Error fetching audiobooks:", error);
            toast.error("Failed to load audiobooks!");
        }
    }
    useEffect(() => {
        fetchAudioBooks();
    }, []);


  return (
    <div className='home'>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="new-audiobooks">
            <div className="title">
                <h1>Mới cập nhật</h1>
            </div>
            {/* Kiểm tra nếu audiobooks chưa có dữ liệu */}
            {audiobooks.length === 0 ? (
                    <p>Đang tải audiobooks...</p>
                ) : (
                    <div className="audiobook-container">
                        {audiobooks.map((audiobook) => (
                            <div className="audiobook-item" key={audiobook.id} onClick={() => navigate(`/${audiobook.id}`)}>
                                <div className="book-image">
                                    <img src={audiobook.image} alt={audiobook.title} />
                                </div>
                                <div className="book-title">
                                    <p>{audiobook.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>

        <div className="new-audiobooks">
            <div className="title">
                <h1>Nổi bật</h1>
            </div>
            <div className="audiobook-container">
                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://nhasachphuongnam.com/images/detailed/217/dac-nhan-tam-bc.jpg" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Đắc nhân tâm</p>
                    </div>
                </div>

                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>

                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>
                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>

                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>

                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>

                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>

                <div className="audiobook-item">
                    <div className="book-image">
                        <img src="https://bizweb.dktcdn.net/100/180/408/products/xu-cat-2-phan-b704f45c-fcb3-4888-b874-b9e4bd621d35-c9cc77db-217c-4c26-8d02-0b2be76a7a2b.jpg?v=1638598294267" alt="" />
                    </div>
                    <div className="book-title">
                        <p>Dune</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home
