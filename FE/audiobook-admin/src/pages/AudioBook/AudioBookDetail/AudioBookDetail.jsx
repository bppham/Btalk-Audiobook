import React, { useEffect, useState } from "react";
import "./AudioBookDetail.css";
import { ToastContainer, toast } from "react-toastify";
import { listCategories } from "../../../services/CategoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { getAudiobookById } from "../../../services/AudiobookService";

const AudioBookDetail = () => {
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
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImage(file);
    }
  };
  // Show image at the beginning
  useEffect(() => {
    if (audioBook && audioBook.image) {
      setImagePreview(audioBook.image);
    }
  }, [audioBook]);


  // Handle File Change
  const [audioPreviews, setAudioPreviews] = useState([]);

  useEffect(() => {
    if (audioBook && audioBook.audioFiles && audioBook.audioFiles.length > 0) {
      const audioUrls = audioBook.audioFiles.map((file) => ({
        url: file.fileUrl, // Tạo URL từ file đã lưu
        name: file.fileName,
      }));
      setAudioPreviews(audioUrls);
      setAudioFiles(audioBook.audioFiles);
    }
  }, [audioBook]);

  const getCategoryString = (categories) => {
    if (!categories || categories.length === 0) return "";
    return categories.join(", ");
  };

  return (
    <div className="audiobook-detail">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Detail the audiobook</h1>
      <div className="form-detail-audiobook">
        <div className="row">
          <div className="item">
            <label>Id</label>
            <input type="text" name="title" value={audioBook.id} readOnly />
          </div>
          <div className="item">
            <label>Title</label>
            <input type="text" name="title" value={audioBook.title} readOnly />
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={audioBook.authorName}
              readOnly
            />
          </div>
          <div className="item">
            <label>Voice</label>
            <input
              type="text"
              name="voice"
              value={audioBook.voiceName}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Image</label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="item">
            <label>Category</label>
            <input
              type="text"
              value={getCategoryString(audioBook.categoryNames)}
              readOnly
            />
          </div>
        </div>
        <div className="row"></div>
        <div className="row">
          <div className="item">
            <label>Audio Files</label>
            {audioPreviews.length > 0 && (
              <div className="audio-preview">
                <ul>
                  {audioPreviews.map((audio, index) => (
                    <li key={index}>
                      <div className="audio-info">
                        <p>{audio.name}</p>
                        <audio controls>
                          <source src={audio.url} type="audio/mpeg" />
                          Trình duyệt của bạn không hỗ trợ audio.
                        </audio>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Description</label>
            <textarea
              name="description"
              value={audioBook.description}
              readOnly
            ></textarea>
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Note</label>
            <textarea name="note" value={audioBook.note} readOnly></textarea>
          </div>
        </div>
      </div>
      <div className="action">
        <button onClick={() => navigate("/audiobooks")}>Back</button>
      </div>
    </div>
  );
};

export default AudioBookDetail;
