import React, { useEffect, useState } from "react";
import "./Ranking.css";
import {
  getTopByDay,
  getTopByMonth,
  getTopByYear,
  getTopByAll,
  getTopByLikes,
  getTopByRating,
} from "../../services/RankingService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTrophy,
  faStar,
  faEarListen,
  faClock,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const Ranking = () => {
  const navigate = useNavigate();
  const [audiobooks, setAudiobooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("day");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const rankingTabs = [
    { id: "day", label: "Ngày", icon: faClock, fetch: getTopByDay },
    { id: "month", label: "Tháng", icon: faCalendarAlt, fetch: getTopByMonth },
    { id: "year", label: "Năm", icon: faCalendarAlt, fetch: getTopByYear },
    { id: "all", label: "Tất cả", icon: faEarListen, fetch: getTopByAll },
    { id: "likes", label: "Yêu thích", icon: faEarListen, fetch: getTopByLikes },
    { id: "rating", label: "Đánh giá", icon: faStar, fetch: getTopByRating },
  ];

  const fetchAudioBooks = async (tabId, pageNumber = 0) => {
    setLoading(true);
    try {
      let response;
      const fetchFunction = rankingTabs.find((tab) => tab.id === tabId).fetch;
      if (tabId === "day") {
        const today = new Date().toISOString().split("T")[0];
        response = await fetchFunction(today, pageNumber, PAGE_SIZE);
      } else if (tabId === "month") {
        const month = new Date().toISOString().slice(0, 7);
        response = await fetchFunction(month, pageNumber, PAGE_SIZE);
      } else if (tabId === "year") {
        const year = new Date().getFullYear();
        response = await fetchFunction(year, pageNumber, PAGE_SIZE);
      } else {
        response = await fetchFunction(pageNumber, PAGE_SIZE);
      }
      setAudiobooks(response.data.result.content);
      setTotalPages(response.data.result.totalPages);
    } catch (error) {
      console.error("Error fetching audiobooks:", error);
      toast.error("Không thể tải danh sách sách nói!");
    } finally {
      setLoading(false);
    }
  };

  // Reset về trang đầu khi đổi tab
  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  // Gọi API khi đổi tab hoặc đổi trang
  useEffect(() => {
    fetchAudioBooks(activeTab, page);
    // eslint-disable-next-line
  }, [activeTab, page]);

  const getTrophyColor = (index) => {
    switch (index) {
      case 0:
        return "#FFD700"; // Gold
      case 1:
        return "#C0C0C0"; // Silver
      case 2:
        return "#CD7F32"; // Bronze
      default:
        return "#808080"; // Gray
    }
  };

  // Tạo mảng số trang để hiển thị (ví dụ: [1,2,3,4,5])
  const getPageNumbers = () => {
    const maxDisplay = 5;
    let start = Math.max(0, page - Math.floor(maxDisplay / 2));
    let end = Math.min(totalPages, start + maxDisplay);
    if (end - start < maxDisplay) {
      start = Math.max(0, end - maxDisplay);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <div className="ranking-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="ranking-container">
        <div className="ranking-header">
          <h1>Bảng xếp hạng sách nói</h1>
          <div className="ranking-tabs">
            {rankingTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <FontAwesomeIcon
                  icon={tab.icon}
                  style={{ marginRight: "5px" }}
                />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="ranking-list">
              {audiobooks.map((book, index) => (
                <div
                  key={book.audioBookId}
                  className="ranking-item"
                  onClick={() => navigate(`/${book.audioBookId}`)}
                >
                  <div className="rank-number">
                    <FontAwesomeIcon
                      icon={faTrophy}
                      color={getTrophyColor(index)}
                    />
                    <span>{index + 1 + page * PAGE_SIZE}</span>
                  </div>
                  <div className="book-info">
                    <div className="book-image">
                      <img src={book.image} alt={book.title} />
                    </div>
                    <div className="book-details">
                      <h3>{book.title}</h3>
                      <div className="book-stats">
                        <span>
                          <FontAwesomeIcon icon={faStar} />{" "}
                          {book.averageRating?.toFixed(1) || "N/A"}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faEarListen} /> {book.likeCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Trang trước
              </button>
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  className={`pagination-btn page-number ${page === num ? "active" : ""}`}
                  onClick={() => setPage(num)}
                >
                  {num + 1}
                </button>
              ))}
              <button
                className="pagination-btn"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Trang sau <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Ranking;
