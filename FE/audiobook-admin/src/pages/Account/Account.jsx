import React, { useEffect, useState, useRef } from "react";
import "./Account.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import {
  changePassword,
  getEmployeeInfo,
  updateInfo,
} from "../../services/AccountService";
import { uploadAvatar } from "../../services/Upload";
const Account = () => {
  const [employee, setEmployee] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState("ABC");
  const [name, setName] = useState(originalName);
  const [orginalPhoneNumber, setOriginalPhoneNumber] = useState("0123");
  const [phoneNumber, setPhoneNumber] = useState(orginalPhoneNumber);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [roleString, setRoleString] = useState("");

  const fetchEmployeeInfo = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeInfo();
      console.log(response);
      if (response.data.code === 1000) {
        setEmployee(response.data.result);
        setName(response.data.result.name);
        setOriginalName(response.data.result.name);
        setPhoneNumber(response.data.result.phoneNumber);
        setOriginalPhoneNumber(response.data.result.phoneNumber);
        setPreview(response.data.result.avatar);
        const formatted = response.data.result.roleNames
          .map((role) => role.charAt(0) + role.slice(1).toLowerCase())
          .join(", ");
        setRoleString(formatted);
      } else {
        toast.error("Cannot get information!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error connect to server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeInfo();
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
      avatar: photoURL,
    };
    const response = await updateInfo(request);
    if (response.data.code === 1000) {
      toast.success("Success");
      setIsEditing(false);
      setOriginalName(name);
      fetchEmployeeInfo();
      setLoading(false);
    } else {
      toast.error("Failed to update");
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (oldPassword === "" || newPassword === "" || retypePassword === "") {
      toast.error("Please fill all the information");
      return;
    } else if (newPassword.length < 6) {
      toast.error("Password has at least 6 characters");
      return;
    } else if (newPassword !== retypePassword) {
      toast.error("Retype password not matched the new password");
      return;
    }
    const request = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    setLoading(true);
    const response = await changePassword(request);
    if (response.data.code === 1000) {
      toast.success("Success");
      setLoading(false);
    } else if (response.data.code === 6006) {
      toast.error("Old password not correct");
      setLoading(false);
    } else {
      toast.error("Failed");
      setLoading(false);
    }
  };

  return (
    <div className="account-container">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
      <h1>Account information</h1>
      {!employee ? (
        <div>Loading ...</div>
      ) : (
        <>
          <div className="top-container">
            <div className="left-container">
              <h3>Information</h3>
              <div className="info-item">
                <label>Id</label>
                <p>{employee.id}</p>
              </div>
              <div className="info-item">
                <p>{roleString}</p>
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
                      Choose image
                    </button>
                  </div>
                )}
              </div>

              <div className="info-container">
                <div className="info-item">
                  <label>Email: </label>
                  <p>{employee.email}</p>
                </div>
                <div className="info-item user-info">
                  <label>Fullname: </label>
                  <input
                    type="text"
                    value={name}
                    disabled={!isEditing}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="info-item user-info">
                  <label>Phone: </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    disabled={!isEditing}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="action">
                  {!isEditing ? (
                    <button onClick={handleEdit} className="btn-change-info">
                      Update information
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleConfirmChangeInfo}
                        className="btn-change-info-confirm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn-change-info-return"
                      >
                        Return
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-container">
            <h3>Change password</h3>
            <div className="info-item">
              <label>Old password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="info-item">
              <label>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="info-item">
              <label>Retype password</label>
              <input
                type="password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
            </div>
            <div className="action">
              <button
                onClick={handleChangePassword}
                className="btn-confirm-change-password"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
