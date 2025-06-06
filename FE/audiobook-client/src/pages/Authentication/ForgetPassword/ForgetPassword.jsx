import { useState } from "react";
import "./ForgetPassword.css";
import sub_img_1 from "../../../assets/auth/forget-password.png"; 
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../../services/Auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgetPassword = async () => {
    if (email.length === 0) {
      toast.error("Vui lòng nhập email");
      return;
    }
    try {
      const response = await forgetPassword(email);
      if (response.code === 1000) {
        toast.success("Success");
        sessionStorage.setItem("email", email);
        navigate("/verify-code");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="forget-password-user">
      <ToastContainer />
      <div className="forget-password-container">
        <div className="forget-password-info">
          <h3>Đây là trang Quên mật khẩu</h3>
          <div className="info-description">
            <li>Nhập email của tài khoản</li>
            <li>Sau đó nhấn "TIẾP TỤC"</li>
            <li>Kiểm tra email của bạn</li>
          </div>
          <img src={sub_img_1} alt="forget-password info" />
        </div>

        <div className="forget-password-section">
          <h2>Email của bạn</h2>
          <div className="forget-password-section-container">
            <div className="item">
              <label>Email:</label>
              <input
                placeholder="example@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="forget-password-action">
            <button onClick={handleForgetPassword}>TIẾP TỤC</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
