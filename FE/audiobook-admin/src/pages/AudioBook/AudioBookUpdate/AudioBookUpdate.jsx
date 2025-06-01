import React, { useEffect, useState } from "react";
import "./AudioBookUpdate.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAudiobookById,
  updateAudiobook,
} from "../../../services/AudiobookService";
import { uploadAudioFiles, uploadBookCover } from "../../../services/Upload";
import { ToastContainer, toast } from "react-toastify";
import { listCategories } from "../../../services/CategoryService";
import { listAuthors } from "../../../services/AuthorService";
import { listVoices } from "../../../services/VoiceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const AudioBookUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Main state
  const [audioBook, setAudioBook] = useState({
    id: "",
    title: "",
    authorId: "",
    voiceId: "",
    description: "",
    note: "",
    categoryIds: [],
    image: "",
    audioFiles: [],
  });

  // Lists
  const [allAuthors, setAllAuthors] = useState([]);
  const [allVoices, setAllVoices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Image preview
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Audio files
  const [audioFiles, setAudioFiles] = useState([]); // Array of File or {fileName, fileUrl}
  const [audioPreviews, setAudioPreviews] = useState([]); // {name, url}

  // Fetch data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bookRes, authorsRes, voicesRes, catsRes] = await Promise.all([
          getAudiobookById(id),
          listAuthors(),
          listVoices(),
          listCategories(),
        ]);
        const book = bookRes.data.result;
        
        // Ensure audioFiles have both fileName and fileUrl
        const processedAudioFiles = (book.audioFiles || []).map(file => ({
          fileName: file.fileName,
          fileUrl: file.fileUrl || `https://res.cloudinary.com/dkcpxrkr3/video/upload/v1/audiobook/audio/${file.fileName}`,
        }));

        setAudioBook({
          id: book.id,
          title: book.title || "",
          authorId: book.authorId || "",
          voiceId: book.voiceId || "",
          description: book.description || "",
          note: book.note || "",
          categoryIds: book.categoryIds || (book.categories ? book.categories.map((c) => c.id) : []),
          image: book.image || "",
          audioFiles: processedAudioFiles,
        });
        setImagePreview(book.image || "");
        setAudioFiles(processedAudioFiles);
        setAudioPreviews(
          processedAudioFiles.map((f) => ({
            name: f.fileName,
            url: f.fileUrl,
          }))
        );
        setAllAuthors(authorsRes.data.result || []);
        setAllVoices(voicesRes.data.result || []);
        setAllCategories(catsRes.data.result || []);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu!");
        console.error(err);
      }
    };
    fetchAll();
  }, [id]);

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
    setAudioFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, fileName: newName } : f))
    );
  };

  // Update handler
  const handleUpdate = async () => {
    try {
      // Handle image upload if new image selected
      let imageUrl = audioBook.image;
      if (imageFile) {
        const imageRes = await uploadBookCover(imageFile);
        imageUrl = imageRes.data.result.url;
      }

      // Separate old and new files
      const oldFiles = [];
      const newFiles = [];
      audioFiles.forEach((file, idx) => {
        const fileName = audioPreviews[idx]?.name || file.fileName || file.name;
        if (file instanceof File) {
          newFiles.push({ file, customName: fileName });
        } else {
          oldFiles.push({
            fileName: file.fileName,
            fileUrl: file.fileUrl || `https://res.cloudinary.com/dkcpxrkr3/video/upload/v1/audiobook/audio/${file.fileName}`,
          });
        }
      });

      // Upload new files if any
      let uploadedFiles = [];
      if (newFiles.length > 0) {
        const res = await uploadAudioFiles(newFiles);
        uploadedFiles = res.data.result || [];
      }

      console.log(uploadedFiles);

      // Prepare final audioFiles
      const finalAudioFiles = [...oldFiles, ...uploadedFiles].map((f) => ({
        fileName: f.fileName,
        fileUrl: f.url || `https://res.cloudinary.com/dkcpxrkr3/video/upload/v1/audiobook/audio/${f.fileName}`,
      }));

      // Prepare payload
      const payload = {
        ...audioBook,
        authorId: Number(audioBook.authorId),
        voiceId: Number(audioBook.voiceId),
        categoryIds: audioBook.categoryIds,
        audioFiles: finalAudioFiles,
        image: imageUrl,
      };

      await updateAudiobook(id, payload);
      toast.success("Cập nhật thành công!");
      navigate("/audiobooks");
    } catch (err) {
      toast.error("Cập nhật thất bại!");
      console.error(err);
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
            <input type="text" value={audioBook.id} readOnly />
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
          <button type="button" onClick={handleUpdate} className="update-button">
            Update Audiobook
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioBookUpdate;
