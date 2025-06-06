import React, { useState, useRef } from "react";
import "./Register.css";
import { uploadAvatar } from "../../../services/Upload";
import { register } from "../../../services/Auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const defaultImage =
    "https://res.cloudinary.com/dkcpxrkr3/image/upload/v1748250537/default-avatar-icon-of-social-media-user-vector_gzsm2f.jpg";
  const [preview, setPreview] = useState(defaultImage);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setPreview(defaultImage);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let photoURL = null;
    if (avatarFile) {
      const response = await uploadAvatar(avatarFile);
      console.log(response.data);
      if (response.data.code === 1000) {
        photoURL = response.data.result.url;
        console.log( response.data.result.url);
      }
    }
    const userToRegister = { ...newUser, photoURL };
    const response = await register(userToRegister);
    if (response.data.code === 1000) {
      toast.success("Tạo tài khoản thành công");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.error("Lỗi tạo tài khoản");
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Đăng ký tài khoản</h2>
        <div className="register-section">
          <div className="left">
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                required
                value={newUser.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Họ tên:</label>
              <input
                type="text"
                name="name"
                required
                value={newUser.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                name="password"
                required
                value={newUser.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="right">
            <div className="form-group">
              <label>Ảnh đại diện:</label>
              <div className="avatar-preview">
                <img src={preview} alt="Avatar Preview" />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }} // ẩn input file
              />

              <div className="avatar-action">
                <button type="button" onClick={handleButtonClick}>
                  Chọn ảnh
                </button>
              </div>
            </div>
            <div className="action">
              <button type="button" onClick={() => navigate("/login")}>Quay lại</button>
              <button type="submit">Đăng ký</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
