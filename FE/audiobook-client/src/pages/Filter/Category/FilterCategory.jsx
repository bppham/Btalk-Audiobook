import React, { useEffect, useState } from "react";
import "./FilterCategory.css";
import { filterCategory } from "../../../services/SearchService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
const FilterCategory = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("name");
  const navigate = useNavigate();
  // Show list audiobook
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAudioBooks = async () => {
    setLoading(true);
    try {
      const response = await filterCategory(categoryId);
      if (response.data.code === 1000) {
        setAudiobooks(response.data.result.content);
      } else {
        toast.error("Không tải được audiobook!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioBooks();
  }, [categoryId]);

  return (
    <div className="filter-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <div className="new-audiobooks">
        <div className="title">
          <h1>Thể loại: {categoryName}</h1>
        </div>
        {/* Kiểm tra nếu audiobooks chưa có dữ liệu */}
        {audiobooks.length === 0 ? (
          <p>Không có kết quả</p>
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

export default FilterCategory;
