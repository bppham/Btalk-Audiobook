import React, { useEffect, useState } from "react";
import "./AudioBookUpdate.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAudiobookById,
  updateAudiobook,
} from "../../../services/AudiobookService";
import { ToastContainer, toast } from "react-toastify";
import { listCategories } from "../../../services/CategoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { listAuthors } from "../../../services/AuthorService";
import { listVoices } from "../../../services/VoiceService";

const AudioBookUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audioBook, setAudioBook] = useState({
    title: "",
    authorId: 0,
    authorName: "",
    voiceId: 0,
    voiceName: "",
    description: "",
    note: "",
    categoryIds: [],
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

  // Handle Author and Voice
  const [seletedAuthorId, setSeletedAuthorId] = useState();
  const [seletedVoiceId, setSeletedVoiceId] = useState();
  useEffect(() => {
    if (audioBook) {
      setSeletedAuthorId(audioBook.authorId);
      setSeletedVoiceId(audioBook.voiceId);
    }
  }, [audioBook]);

  const [allAuthors, setAuthors] = useState([]);
  const fetchAuthors = async () => {
    try {
      const response = await listAuthors();
      setAuthors(response.data.result);
    } catch (error) {
      console.error("Error fetching authors:", error);
      toast.error("Failed to load authors!");
    }
  };

  const handleAuthorChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === "new") {
      navigate("/authors");
    } else {
      const authorId = Number(selectedId);
      setSeletedAuthorId(authorId);
      setAudioBook({ ...audioBook, authorId }); // Gửi object có id
    }
  };

  const [allVoices, setVoices] = useState([]);
  const fetchVoices = async () => {
    try {
      const response = await listVoices();
      setVoices(response.data.result);
    } catch (error) {
      console.error("Error fetching voices:", error);
      toast.error("Failed to load voices!");
    }
  };

  const handleVoiceChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === "new") {
      navigate("/voices");
    } else {
      const voiceId = Number(selectedId);
      setSeletedVoiceId(voiceId);
      setAudioBook({ ...audioBook, voiceId }); // Gửi object có id
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchVoices();
  }, []);

  // useEffect(() => {
  //     if (audioBook?.author && typeof audioBook.author === "object") {
  //         setAudioBook((prev) => ({
  //             ...prev,
  //             author: audioBook.author.id, // Lưu ID thay vì object
  //         }));
  //     }
  // }, [audioBook.author]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAudioBook((prev) => ({ ...prev, [name]: value }));
  };

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

  // Return image url
  const handleImageUrl = (url) => {
    return "http://localhost:8080/files/" + url;
  };

  // Return file url
  const handleFileUrl = (url) => {
    return "http://localhost:8080/files/" + url;
  };

  // Show image at the beginning
  useEffect(() => {
    if (audioBook && audioBook.image) {
      const urlImage = handleImageUrl(audioBook.image);
      setImagePreview(urlImage);
    }
  }, [audioBook]);

  // Handel categories
  const [allCategories, setAllCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      setAllCategories(response.data.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories!");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (audioBook?.categories?.length > 0) {
      // Kiểm tra nếu categories chưa phải danh sách ID, thì mới cập nhật
      if (typeof audioBook.categories[0] === "object") {
        const categoryIds = audioBook.categories.map((cat) => cat.id);
        setAudioBook((prev) => ({
          ...prev,
          categories: categoryIds,
        }));
      }
    }
  }, [audioBook]);

  const handleCategoryChange = (event) => {
    const categoryId = Number(event.target.value);

    setAudioBook((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId) // Bỏ nếu đã chọn
        : [...prev.categoryIds, categoryId], // Thêm nếu chưa
    }));
  };

  // Handle File Change
  const [audioPreviews, setAudioPreviews] = useState([]);
  const handleAudioFiles = (event) => {
    const files = Array.from(event.target.files);
    console.log(files.length);
    if (files.length > 0) {
      const newPreviews = files.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setAudioPreviews((prev) => [...prev, ...newPreviews]);
      setAudioFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = audioFiles.filter((_, i) => i !== index);
    setAudioFiles(updatedFiles);
    setAudioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (audioBook && audioBook.audioFiles && audioBook.audioFiles.length > 0) {
      const audioUrls = audioBook.audioFiles.map((file) => ({
        url: handleFileUrl(file.fileUrl), // Tạo URL từ file đã lưu
        name: file.fileName,
      }));
      setAudioPreviews(audioUrls);
      setAudioFiles(audioBook.audioFiles);
    }
  }, [audioBook]);

  // Handle update data
  const handleUpdate = async () => {
    console.log(audioBook);
    try {
      await updateAudiobook(id, audioBook, image, audioFiles);
      toast.success("Updated successfully!");
      navigate("/audiobooks");
    } catch (error) {
      console.error("Error updating audiobook:", error);
      toast.error("Update failed!");
    }
  };

  return (
    <div className="audiobook-update">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Update an audiobook</h1>
      <div className="form-update-audiobook">
        <div className="row">
          <div className="item">
            <label>Id</label>
            <input type="text" name="title" value={audioBook.id} readOnly />
          </div>
          <div className="item">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={audioBook.title}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Author</label>
            <select
              name="author"
              value={audioBook.authorId}
              onChange={handleAuthorChange}
            >
              <option value="">Chọn tác giả</option>
              {allAuthors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
              <option value="new">Thêm tác giả mới</option>
            </select>
          </div>
          <div className="item">
            <label>Voice</label>
            <select
              name="voice"
              value={audioBook.voiceId}
              onChange={handleVoiceChange}
            >
              <option value="">Chọn giọng đọc</option>
              {allVoices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
              <option value="new">Thêm giọng đọc mới</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Image</label>
            <input
              type="file"
              name="image"
              id=""
              onChange={handleImageChange}
            />
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        <div className="row">
          <label>Categories</label>
          <div className="category-list">
            {allCategories.map((category) => (
              <label key={category.id} className="category-item">
                <input
                  type="checkbox"
                  value={category.id}
                  onChange={handleCategoryChange}
                  checked={audioBook.categoryIds.includes(category.id)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Audio Files</label>
            <input
              type="file"
              name="audioFiles"
              multiple
              accept="audio/*"
              onChange={handleAudioFiles}
            />
          </div>
          <div className="item">
            {audioPreviews.length > 0 && (
              <div className="audio-preview">
                <ul>
                  {audioPreviews.map((audio, index) => (
                    <li key={index}>
                      <div className="action">
                        <button
                          onClick={() => removeFile(index)}
                          style={{
                            marginLeft: "10px",
                            cursor: "pointer",
                            color: "red",
                          }}
                        >
                          <FontAwesomeIcon icon={faX} className="icon" />
                        </button>
                      </div>
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
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
        <div className="row">
          <div className="item">
            <label>Note</label>
            <textarea
              name="note"
              value={audioBook.note}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="action">
        <button onClick={handleUpdate}>Confirm</button>
        <button onClick={() => navigate("/audiobooks")}>Cancel</button>
      </div>
    </div>
  );
};

export default AudioBookUpdate;
