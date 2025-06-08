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
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Rating from "../../components/Rating/Rating";
import AudiobookPlayer from "../../components/AudioPlayer/AudioPlayer";
import { useNavigate, useParams } from "react-router-dom";
import { getAudiobookById } from "../../services/AudiobookService";
import { toggleLike } from "../../services/LikeService";
import { ratingAudiobook } from "../../services/RatingService";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  saveToLibrary,
  removeFromLibrary,
} from "../../services/LibraryService";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

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

  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);

  // Get audiobook by id
  const fetchData = async () => {
    try {
      const response = await getAudiobookById(id);
      console.log(response);
      if (response.data.code === 1000) {
        const result = response.data.result;

        setAudioBook(result);

        setLikeCount(result.likeCount || 0);
        setLiked(result.likedByCurrentUser || false);

        setRating(result.userRating || 0);
        setRatingCount(result.ratingCount);
        setRatinigAverage(result.averageRating);

        setIsSaved(result.savedByCurrentUser || false);

        setListenCount(result.listenCount);
      }
    } catch (error) {
      console.error("Error fetching audiobook: " + error);
    } finally {
      setLoading(false);
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
    if (!user) {
      toast.error("Vui lòng đăng nhập để thao tác");
    } else {
      try {
        setLoading(true);
        const res = await toggleLike(id);
        const { likeCount, likedByCurrentUser } = res.data.result;

        setLikeCount(likeCount);
        setLiked(likedByCurrentUser);
      } catch (error) {
        console.error("Toggle like failed", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Rating stars
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingAvarage, setRatinigAverage] = useState(0);
  const handleRating = async (value) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thao tác");
    } else {
      setLoading(true);
      setRating(value);
      try {
        const res = await ratingAudiobook(id, value);
        const { averageRating, totalRatings } = res.data.result;

        setRatingCount(totalRatings);
        setRatinigAverage(averageRating);
      } catch (error) {
        console.error("Rating failed", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Save to library
  const [isSaved, setIsSaved] = useState(false);
  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thao tác");
    } else {
      try {
        setLoading(true);
        if (isSaved) {
          await removeFromLibrary(id);
          setIsSaved(false);
        } else {
          await saveToLibrary(id);
          setIsSaved(true);
        }
      } catch (err) {
        console.error("Toggle save failed", err);
        toast.error("Thao tác thất bại!");
      } finally {
        setLoading(false);
      }
    }
  };

  // Listen count
  const [listenCount, setListenCount] = useState(0);

  return (
    <div className="audiobook">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
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
                <p>{listenCount}</p>
              </div>
            </div>
          </div>
          <div className="action-section">
            <button
              className={`library-button ${isSaved ? "saved" : ""}`}
              onClick={handleToggleSave}
            >
              <FontAwesomeIcon icon={isSaved ? faCheckCircle : faThumbTack} />
              <span>
                {isSaved
                  ? "Đã thêm vào thư viện"
                  : "Thêm vào danh sách nghe sau"}
              </span>
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
        <AudiobookPlayer audioFiles={audioFiles} audioBookId={id} />
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
