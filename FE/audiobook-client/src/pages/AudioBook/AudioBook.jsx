import React, { useEffect, useState } from "react";
import "./AudioBook.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faUser,
  faMicrophoneLines,
  faHeadphones,
  faThumbTack,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import Rating from "../../components/Rating/Rating";
import AudiobookPlayer from "../../components/AudioPlayer/AudioPlayer";
import { useNavigate, useParams } from "react-router-dom";
import { getAudiobookById } from "../../services/AudiobookService";
import { toggleLike } from "../../services/LikeService";
import { ratingAudiobook } from "../../services/RatingService";

const AudioBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audioBook, setAudioBook] = useState({
    title: "",
    authorName: "",
    voiceName: "",
    description: "",
    note: "",
    categoryNames: [],
  });

  const [image, setImage] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);

  // Get audiobook by id
  const fetchData = async () => {
    try {
      const response = await getAudiobookById(id);
      const result = response.data.result;
      console.log("📥 API Response:", result);
      setAudioBook(result);
      
      setLikeCount(result.likeCount || 0);
      setLiked(result.likedByCurrentUser || false);
      
      setRating(result.userRating || 0);
      setRatingCount(result.ratingCount);
      setRatinigAverage(result.averageRating);
    } catch (error) {
      console.error("Error fetching audiobook: " + error);
    }
  };

  useEffect(() => {
    const fetchAudioBook = async () => {
      await fetchData();
    };
    fetchAudioBook();
  }, [id]);

  // Preview Image
  const [imagePreview, setImagePreview] = useState(null);
  useEffect(() => {
    if (audioBook && audioBook.image) {
      const urlImage = audioBook.image;
      setImagePreview(urlImage);
    }
  }, [audioBook]);

  // String category
  const getCategoryString = (categories) => {
    if (!categories || categories.length === 0) return "";
    return categories.join(", ");
  };

  useEffect(() => {
    if (audioBook && audioBook.audioFiles && audioBook.audioFiles.length > 0) {
      const audioUrls = audioBook.audioFiles.map((file) => ({
        url: file.fileUrl, // Tạo URL từ file đã lưu
        name: file.fileName,
      }));
      setAudioFiles(audioBook.audioFiles);
      console.log("AudioFiles: ", audioFiles);
    }
  }, [audioBook]);

  // Like
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const handleToggleLike = async () => {
    try {
      const res = await toggleLike(id);
      const { likeCount, likedByCurrentUser } = res.data.result;

      setLikeCount(likeCount);
      setLiked(likedByCurrentUser);
    } catch (error) {
      console.error("Toggle like failed", error);
    }
  };

  // Rating stars
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingAvarage, setRatinigAverage] = useState(0);
  const handleRating = async (value) => {
    setRating(value);
    try {
      const res = await ratingAudiobook(id, value);
      const { averageRating, totalRatings } = res.data.result;

      setRatingCount(totalRatings);
      setRatinigAverage(averageRating);
    } catch (error) {
      console.error("Rating failed", error);
    }
  };

  return (
    <div className="audiobook">
      <div className="quick-information">
        <div className="book-cover">
          <img src={imagePreview} alt="Preview" />
        </div>
        <div className="info-container">
          <div className="info-section">
            <div className="title">
              <h1>{audioBook.title}</h1>
            </div>
            <div className="detail">
              <div className="item">
                <label>
                  <FontAwesomeIcon icon={faLayerGroup} /> Thể loại:{" "}
                </label>
                <p>{getCategoryString(audioBook.categoryNames)}</p>
              </div>
              <div className="item">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  Tác giả:{" "}
                </label>
                <p>{audioBook.authorName}</p>
              </div>
              <div className="item">
                <label>
                  {" "}
                  <FontAwesomeIcon icon={faMicrophoneLines} /> Giọng đọc:{" "}
                </label>
                <p>{audioBook.voiceName}</p>
              </div>
              <div className="item">
                <label>
                  {" "}
                  <FontAwesomeIcon icon={faHeadphones} /> Lượt nghe:{" "}
                </label>
                <p>300</p>
              </div>
            </div>
          </div>
          <div className="action-section">
            <button>
              <FontAwesomeIcon icon={faThumbTack} />
              <p>Thêm vào danh sách nghe sau</p>
            </button>
            <div className="like-section">
              <button
                className={`like-button ${liked ? "liked" : ""}`}
                onClick={handleToggleLike}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rating">
        <div className="score-average">
          <div className="score">
            <span>{ratingAvarage}</span>
          </div>
          <div className="vote-count">{ratingCount} lượt đánh giá</div>
        </div>
        <div className="rating-section">
          <Rating value={rating} onChange={handleRating} />
          <p className="rating-text">Đánh giá: {rating} sao</p>
        </div>
      </div>
      <div className="audiobook-section">
        <AudiobookPlayer audioFiles={audioFiles} />
      </div>
      <fieldset className="description-container">
        <legend>Mô tả</legend>
        <p>{audioBook.description}</p>
      </fieldset>
      <fieldset className="note-container">
        <legend>Ghi chú</legend>
        <p>{audioBook.note}</p>
      </fieldset>
    </div>
  );
};

export default AudioBook;
