import React, { use, useEffect, useState, useRef } from "react";
import "./Account.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  changePassword,
  getUserInfo,
  updateInfo,
} from "../../services/UserService";
import { uploadAvatar } from "../../services/Upload";
const Account = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState("ABC");
  const [name, setName] = useState(originalName);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // 👈 thêm vào đầu component

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await getUserInfo();
      console.log(response);
      if (response.data.code === 1000) {
        setUser(response.data.result);
        setName(response.data.result.name);
        setOriginalName(response.data.result.name);
        setPreview(response.data.result.photoURL);
      } else {
        toast.error("Không lấy được thông tin!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const [preview, setPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(originalName); // quay lại tên gốc
    setIsEditing(false);
  };

  const handleConfirm = () => {
    setOriginalName(name); // lưu tên mới
    setIsEditing(false);
  };

  const handleConfirmChangeInfo = async (e) => {
    setLoading(true);
    e.preventDefault();
    let photoURL = null;
    if (avatarFile) {
      const response = await uploadAvatar(avatarFile);
      console.log(response.data);
      if (response.data.code === 1000) {
        photoURL = response.data.result.url;
        console.log(response.data.result.url);
      }
    }
    const request = {
      name: name,
      photoURL,
    };
    const response = await updateInfo(request);
    if (response.data.code === 1000) {
      toast.success("Thành công");
      setIsEditing(false);
      setOriginalName(name);
      fetchUserInfo();
      setLoading(false);
    } else {
      toast.error("Thất bại");
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (oldPassword === "" || newPassword === "" || retypePassword === "") {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    } else if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 kí tự");
      return;
    } else if (newPassword !== retypePassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    const request = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    setLoading(true);
    const response = await changePassword(request);
    if (response.data.code === 1000) {
      toast.success("Thành công");
      setLoading(false);
    } else if (response.data.code === 6006) {
      toast.error("Mật khẩu cũ không chính xác");
      setLoading(false);
    } else {
      toast.error("Thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="account-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <h1>THÔNG TIN CÁ NHÂN</h1>
      {!user ? (
        <div>Đang tải thông tin...</div>
      ) : (
        <>
          <div className="top-container">
            <div className="left-container">
              <h3>Dánh sách sách nói</h3>
              <div className="info-item">
                <label>Số sách trong thư viện: </label>
                <p>{user.numAudiobookInLibrary}</p>
              </div>
              <div className="info-item">
                <label>Số sách đã thích: </label>
                <p>{user.numLikeAudiobook}</p>
              </div>
              <div className="info-item">
                <label>Số sách đã đánh giá: </label>
                <p>{user.numAudiobookInLibrary}</p>
              </div>
            </div>
            <div className="right-container">
              <div className="avatar">
                <img src={preview} alt="Avatar" />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange} // Tùy bạn xử lý
                />
                {isEditing && (
                  <div className="avatar-action">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                    >
                      Chọn ảnh
                    </button>
                  </div>
                )}
              </div>

              <div className="info-container">
                <div className="info-item">
                  <label>Id </label>
                  <p>{user.id}</p>
                </div>
                <div className="info-item">
                  <label>Email: </label>
                  <p>{user.email}</p>
                </div>
                <div className="info-item user-info">
                  <label>Họ và tên: </label>
                  <input
                    type="text"
                    value={name}
                    disabled={!isEditing}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="action">
                  {!isEditing ? (
                    <button onClick={handleEdit} className="btn-change-info">
                      Cập nhật thông tin cá nhân
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleConfirmChangeInfo}
                        className="btn-change-info-confirm"
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn-change-info-return"
                      >
                        Quay lại
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-container">
            <h3>Đổi mật khẩu</h3>
            <div className="info-item">
              <label>Mật khẩu cũ</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="info-item">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="info-item">
              <label>Nhập lại mật khẩu mới</label>
              <input
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
            </div>
            <div className="action">
              <button onClick={handleChangePassword}>Xác nhận</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
