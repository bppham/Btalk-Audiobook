import React, { useState, useEffect } from "react";
import "./AudioBookAdd.css";
import { listCategories } from "../../../services/CategoryService";
import { listAuthors } from "../../../services/AuthorService";
import { listVoices } from "../../../services/VoiceService";
import { useNavigate } from "react-router-dom";
import { addAudioBook } from "../../../services/AudiobookService";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
const AudioBookAdd = () => {
  const navigate = useNavigate();

  const [audioBook, setAudioBook] = useState({
    title: "",
    description: "",
    author: "",
    voice: "",
    note: "",
    categories: [],
  });

  const [image, setImage] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);

  // Handle input
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

  const handleCategoryChange = (event) => {
    const categoryId = Number(event.target.value);
    console.log("Category ID:", categoryId, "Type:", typeof categoryId);

    setAudioBook((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId) // Bỏ nếu đã có
        : [...prev.categories, categoryId], // Thêm nếu chưa có
    }));
  };

  // Handle Author and Voice
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
    const selectedValue = e.target.value;
    console.log(selectedValue);
    if (selectedValue === "new") {
      navigate("/authors");
    } else {
      setAudioBook({ ...audioBook, author: selectedValue });
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
    const selectedValue = e.target.value;
    console.log(selectedValue);
    if (selectedValue === "new") {
      navigate("/voices");
    } else {
      setAudioBook({ ...audioBook, voice: selectedValue });
    }
  };

  useEffect(() => {
    fetchAuthors();
    fetchVoices();
  }, []);

  // Handle File Change
  const handleAudioFiles = (e) => {
    const files = Array.from(e.target.files);
    setAudioFiles([...audioFiles, ...files]);
  };

  const removeFile = (index) => {
    const updatedFiles = audioFiles.filter((_, i) => i !== index);
    setAudioFiles(updatedFiles);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chuyển đổi categories thành danh sách object { id: categoryId }
    // const formattedAudioBook = {
    //     ...audioBook,
    //     author: audioBook.author ? {id: audioBook.author} : null,
    //     voice: audioBook.voice ? {id: audioBook.voice} : null,
    //     categories: audioBook.categories.map(id => ({ id })) // Chuyển đổi danh sách số thành danh sách object
    // };

    const formattedAudioBook = {
      title: audioBook.title,
      description: audioBook.description,
      note: audioBook.note,
      authorId: audioBook.author, // ID thôi, không phải object
      voiceId: audioBook.voice, // ID thôi
      categoryIds: audioBook.categories, // Mảng ID số
    };
    console.log("formattedAudiobook ", formattedAudioBook);
    const formData = new FormData();
    formData.append(
      "audioBook",
      new Blob([JSON.stringify(formattedAudioBook)], {
        type: "application/json",
      })
    ); // Đúng cách gửi JSON
    if (image) formData.append("image", image);
    audioFiles.forEach((file) => {
      formData.append("audioFile", file);
    });

    try {
      await addAudioBook(formData);
      toast.success("Audiobook added successfully!");
      navigate("/audiobooks"); // Quay lại trang danh sách
    } catch (error) {
      toast.error("Failed to add audiobook!");
      console.error(error);
    }
  };

  return (
    <div className="audiobook-add">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Add an audiobook</h1>
      <div className="form-add-audiobook">
        <div className="row">
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
              value={audioBook.author || ""}
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
              value={audioBook.voice || ""}
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
                  checked={audioBook.categories.includes(category.id)}
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
            <ul className="show-audio-preview">
              {audioFiles.map((file, index) => (
                <li key={index}>
                  {file.name}
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
                </li>
              ))}
            </ul>
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
        <button onClick={handleSubmit}>Save</button>
        <button onClick={() => navigate("/audiobooks")}>Cancel</button>
      </div>
    </div>
  );
};

export default AudioBookAdd;
