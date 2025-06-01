import React, { useState, useEffect } from "react";
import "./AudioBookAdd.css";
import { listCategories } from "../../../services/CategoryService";
import { listAuthors } from "../../../services/AuthorService";
import { listVoices } from "../../../services/VoiceService";
import { useNavigate } from "react-router-dom";
import { addAudiobook } from "../../../services/AudiobookService";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { uploadAudioFiles, uploadBookCover } from "../../../services/Upload";

const AudioBookAdd = () => {
  const navigate = useNavigate();
  
  // Main state
  const [audioBook, setAudioBook] = useState({
    title: "",
    description: "",
    authorId: "",
    voiceId: "",
    note: "",
    categoryIds: [],
  });

  // Lists
  const [allAuthors, setAllAuthors] = useState([]);
  const [allVoices, setAllVoices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Image preview
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Audio files
  const [audioFiles, setAudioFiles] = useState([]); // Array of File objects
  const [audioPreviews, setAudioPreviews] = useState([]); // {name, url}

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAudioBook((prev) => ({ ...prev, [name]: value }));
  };

  // Handle author/voice select
  const handleAuthorChange = (e) => {
    const val = e.target.value;
    if (val === "new") {
      navigate("/authors");
    } else {
      setAudioBook((prev) => ({ ...prev, authorId: val }));
    }
  };

  const handleVoiceChange = (e) => {
    const val = e.target.value;
    if (val === "new") {
      navigate("/voices");
    } else {
      setAudioBook((prev) => ({ ...prev, voiceId: val }));
    }
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle categories
  const handleCategoryChange = (e) => {
    const categoryId = Number(e.target.value);
    setAudioBook((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  // Handle audio files
  const handleAudioFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setAudioFiles((prev) => [...prev, ...files]);
    setAudioPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove audio file
  const removeFile = (index) => {
    setAudioFiles((prev) => prev.filter((_, i) => i !== index));
    setAudioPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Change audio file name
  const handleInputFileNameChange = (index, newName) => {
    setAudioPreviews((prev) =>
      prev.map((f, i) => (i === index ? { ...f, name: newName } : f))
    );
  };

  // Fetch initial data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [authorsRes, voicesRes, catsRes] = await Promise.all([
          listAuthors(),
          listVoices(),
          listCategories(),
        ]);
        setAllAuthors(authorsRes.data.result || []);
        setAllVoices(voicesRes.data.result || []);
        setAllCategories(catsRes.data.result || []);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu!");
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  // Handle Submit
  const handleSubmit = async () => {
    try {
      // Handle image upload
      let imageUrl = null;
      if (imageFile) {
        const imageRes = await uploadBookCover(imageFile);
        imageUrl = imageRes.data.result.url;
      }

      // Handle audio files upload
      let uploadedAudioFiles = [];
      if (audioFiles.length > 0) {
        const newFiles = audioFiles.map((file, idx) => ({
          file,
          customName: audioPreviews[idx].name,
        }));
        const resAudio = await uploadAudioFiles(newFiles);
        uploadedAudioFiles = resAudio.data.result.map((file) => ({
          fileName: file.fileName,
          fileUrl: file.url,
        }));
      }

      // Prepare payload
      const payload = {
        title: audioBook.title,
        description: audioBook.description,
        note: audioBook.note,
        authorId: Number(audioBook.authorId),
        voiceId: Number(audioBook.voiceId),
        categoryIds: audioBook.categoryIds,
        image: imageUrl,
        audioFiles: uploadedAudioFiles,
      };

      await addAudiobook(payload);
      toast.success("Audiobook added successfully!");
      navigate("/audiobooks");
    } catch (err) {
      toast.error("Failed to add audiobook!");
      console.error(err);
    }
  };

  return (
    <div className="audiobook-update">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Add an audiobook</h1>
      <div className="form-update-audiobook">
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
            <label>Description</label>
            <textarea
              name="description"
              value={audioBook.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="item">
            <label>Author</label>
            <select
              name="authorId"
              value={audioBook.authorId || ""}
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
              name="voiceId"
              value={audioBook.voiceId || ""}
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
            <label>Categories</label>
            <div className="categories-container">
              {allCategories.map((category) => (
                <div key={category.id} className="category-item">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={audioBook.categoryIds.includes(category.id)}
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor={`category-${category.id}`}>
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="item">
            <label>Note</label>
            <textarea
              name="note"
              value={audioBook.note}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="item">
            <label>Cover Image</label>
            <div className="cover-container">
              <input
                type="file"
                id="fileInput"
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Chọn ảnh
              </button>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="item">
            <label>Audio Files</label>
            <div className="audio-files-container">
              <input
                type="file"
                id="audioInput"
                onChange={handleAudioFiles}
                style={{ display: "none" }}
                accept="audio/*"
                multiple
              />
              <button
                type="button"
                onClick={() => document.getElementById("audioInput").click()}
              >
                Chọn file audio
              </button>
              <div className="audio-files-list">
                {audioPreviews.map((file, index) => (
                  <div key={index} className="audio-file-item">
                    <input
                      type="text"
                      value={file.name}
                      onChange={(e) =>
                        handleInputFileNameChange(index, e.target.value)
                      }
                    />
                    <audio controls src={file.url} />
                    <button
                      type="button"
                      className="remove-file"
                      onClick={() => removeFile(index)}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <button type="button" onClick={handleSubmit} className="update-button">
            Add Audiobook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioBookAdd;
