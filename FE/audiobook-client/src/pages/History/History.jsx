import React, { useEffect, useState } from "react";
import "./History.css";
import { getAllFromHistory } from "../../services/ListenService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const History = () => {
  const navigate = useNavigate();
  // Show list audiobook
  const [audiobooks, setAudiobooks] = useState([]);

  const fetchAudioBooks = async () => {
    try {
      const response = await getAllFromHistory();
      console.log(response);
      setAudiobooks(response.data.result);
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
      toast.error("Failed to load audiobooks!");
    }
  };
  useEffect(() => {
    fetchAudioBooks();
  }, []);

  return (
    <div className="home">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="new-audiobooks">
        <div className="title">
          <h1>Lịch sử</h1>
        </div>
        {/* Kiểm tra nếu audiobooks chưa có dữ liệu */}
        {audiobooks.length === 0 ? (
          <p>Đang tải audiobooks...</p>
        ) : (
          <div className="audiobook-container">
            {audiobooks.map((audiobook) => (
              <div
                className="audiobook-item"
                key={audiobook.audioBookId}
                onClick={() => navigate(`/${audiobook.audioBookId}`)}
              >
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
    </div>
  );
};

export default History;
