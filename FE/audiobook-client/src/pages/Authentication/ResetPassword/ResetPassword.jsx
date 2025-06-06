import React, { useRef, useState, useEffect } from "react";
import sub_img_1 from "../../../assets/auth/forget-password.png"; 
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { resetPassword } from "../../../services/Auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      navigate("/login");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleResetPassword = async () => {
    if (password === "" || retypePassword === "") {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    } else if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 kí tự");
      return;
    } else if (password !== retypePassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    try {
      setLoading(true);
      const response = await resetPassword(email, password);
      if (response.code === 1000) {
        toast.success("Tạo mật khẩu mới thành công");
        sessionStorage.removeItem("email");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      toast.error(error || "Có lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-admin">
      <ToastContainer />
      <div className="reset-password-container">
        <div className="reset-password-info">
          <h3>Tạo mật khẩu mới</h3>
          <div className="info-description">
            <li>Tạo mật khẩu mới của bạn</li>
            <li>Mật khẩu nhập lại phải giống mật khẩu vừa tạo</li>
            <li>Bạn sẽ được quay về trang Đăng nhập nếu hoàn thành</li>
          </div>
          <img src={sub_img_1} alt="reset-password info" />
        </div>

        <div className="reset-password-section">
          <h2>TẠO MẬT KHẨU MỚI</h2>
          <div className="reset-password-section-container">
            <div className="item">
              <label>Mật khẩu mới:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Mật khẩu mới của bạn ..."
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="item">
              <label>Nhập lại mật khẩu:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={retypePassword}
                  placeholder="Mật khẩu nhập lại ..."
                  onChange={(e) => setRetypePassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div className="reset-password-action">
            <button onClick={handleResetPassword}>XÁC NHẬN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
