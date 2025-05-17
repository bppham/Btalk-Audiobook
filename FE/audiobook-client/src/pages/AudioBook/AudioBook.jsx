import React, { useEffect, useState } from "react";
import "./AudioBook.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faUser,
  faMicrophoneLines,
  faHeadphones,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";
import Rating from "../../components/Rating/Rating";
import AudiobookPlayer from "../../components/AudioPlayer/AudioPlayer";
import { useNavigate, useParams } from "react-router-dom";
import { getAudiobookById } from "../../services/AudiobookService";

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
      console.log("📥 API Response:", response.data);
      setAudioBook(response.data.result);
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
      const urlImage = handleImageUrl(audioBook.image);
      setImagePreview(urlImage);
    }
  }, [audioBook]);

  // Return image url
  const handleImageUrl = (url) => {
    return "http://localhost:8080/files/" + url;
  };

  // Return file url
  const handleFileUrl = (url) => {
    return "http://localhost:8080/files/" + url;
  };

  // String category
  const getCategoryString = (categories) => {
    if (!categories || categories.length === 0) return "";
    return categories.join(", ");
  };

  useEffect(() => {
    if (audioBook && audioBook.audioFiles && audioBook.audioFiles.length > 0) {
      const audioUrls = audioBook.audioFiles.map((file) => ({
        url: handleFileUrl(file.fileUrl), // Tạo URL từ file đã lưu
        name: file.fileName,
      }));
      setAudioFiles(audioBook.audioFiles);
      console.log("AudioFiles: ", audioFiles);
    }
  }, [audioBook]);

  // Rating stars
  const [rating, setRating] = useState(0);
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
              <p>Ghim</p>
            </button>
          </div>
        </div>
      </div>

      <div className="rating">
        <div className="score-average">
          <div className="score">
            <span>4.6</span>
          </div>
          <div className="vote-count">26 lượt đánh giá</div>
        </div>
        <div className="rating-section">
          <Rating value={rating} onChange={setRating} />
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
