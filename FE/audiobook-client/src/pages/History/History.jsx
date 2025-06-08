import React, { useEffect, useState } from "react";
import "./History.css";
import { getAllFromHistory } from "../../services/ListenService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const History = () => {
  const navigate = useNavigate();
  // Show list audiobook
  const { user, loading: authLoading } = useAuth(); // dùng hook useAuth()
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAudioBooks = async () => {
    try {
      const response = await getAllFromHistory();
      if (response.data.code === 1000) {
        setAudiobooks(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
      toast.error("Lỗi khi tải audiobook!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAudioBooks();
    }
  }, [user]);

  if (authLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Đang kiểm tra trạng thái đăng nhập...
      </p>
    );
  }

  if (!user) {
    return (
      <div className="history-message">
        <p>
          Vui lòng <b>Đăng nhập</b> để truy cập thư viện.
        </p>
      </div>
    );
  }

  return (
    <div className="home">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <div className="new-audiobooks">
        <div className="title">
          <h1>Lịch sử</h1>
        </div>
        {loading ? (
          <p>Đang tải audiobook...</p>
        ) : audiobooks.length === 0 ? (
          <p>📭 Lịch sử của bạn hiện đang trống.</p>
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
