import React, { useEffect, useState } from "react";
import "./Search.css";
import { search } from "../../services/SearchService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
const Search = () => {
  const [params] = useSearchParams();
  const keyword = params.get('keyword');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Show list audiobook
  const [audiobooks, setAudiobooks] = useState([]);
  
  const fetchAudioBooks = async () => {
    try {
      const response = await search(keyword);
      console.log(response);
      setAudiobooks(response.data.result.content);
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
      toast.error("Failed to load audiobooks!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAudioBooks();
  }, [keyword]);

  return (
    <div className="search-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <div className="new-audiobooks">
        <div className="title">
          <h1>Tìm kiếm: {keyword}</h1>
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
                onClick={() => navigate(`/${audiobook.id}`)}
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

export default Search;
