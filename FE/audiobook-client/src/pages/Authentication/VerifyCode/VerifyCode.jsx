import React, { useRef, useState, useEffect } from "react";
import "./VerifyCode.css";
import sub_img_1 from "../../../assets/auth/forget-password.png"; 
import { useNavigate } from "react-router-dom";
import { forgetPassword, verifyCode } from "../../../services/Auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyCode = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(120); // 120 giây (2 phút)
  const [expired, setExpired] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      navigate("/forget-password");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (expired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Nếu giá trị rỗng => xóa ký tự tại index đó
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Chỉ cho phép số
    if (!/^\d$/.test(value)) {
      return;
    }

    // Cập nhật giá trị OTP
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Di chuyển sang ô tiếp theo nếu có
    if (inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !e.target.value &&
      inputsRef.current[index - 1]
    ) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Gửi OTP lên backend để xác thực
  const handleVerifyOTP = async () => {
    if (expired) {
      toast.error("OTP đã hết hạn");
      return;
    }

    const enteredOTP = otp.join("");
    if (enteredOTP.length !== 6) {
      toast.error("Vui lòng nhập mã xác nhận");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyCode(email, enteredOTP);

      if (response.code === 1000) {
        toast.success("Mã chính xác");
        setTimeout(() => {
          navigate("/reset-password");
        }, 3000);
      } else {
        toast.error("OTP xác nhận sai");
      }
    } catch (error) {
      toast.error(error.message || "OTP không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await forgetPassword(email);
      if (response.code === 1000) {
        toast.success("Gửi lại OTP thành công!");
        setTimeLeft(120);
        setExpired(false);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Không thể gửi lại mã");
    }
  };

  return (
    <div className="verify-code-user">
      <ToastContainer />
      <div className="verify-code-container">
        <div className="verify-code-info">
          <h3>This is the verify code page</h3>
          <div className="info-description">
            <li>Kiểm tra email của bạn</li>
            <li>Nhấn "TIẾP TỤC" để qua bước tiếp theo</li>
            <li>Gửi lại mã nếu mã hết hạn</li>
            <li>Đổi email nếu cần</li>
          </div>
          <img src={sub_img_1} alt="verify-code info" />
        </div>

        <div className="verify-code-section">
          <div className="verify-code-section-container">
            <div className="verify-otp-card">
              <h3>Mã xác nhận</h3>
              <p>(Kiểm tra email)</p>

              <div className="otp-input-group">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    pattern="[0-9]{1}"
                    className="otp-input"
                    value={otp[index]}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={expired}
                  />
                ))}
              </div>

              <div className="countdown-timer">
                <p>
                  OTP hết hạn sau: <span>{formatTime(timeLeft)}</span>
                </p>
              </div>

              <button
                className="verify-btn"
                onClick={handleVerifyOTP}
                disabled={expired || loading}
              >
                {loading
                  ? "Đang kiểm tra ..."
                  : expired
                  ? "Mã hết hạn"
                  : "Kiểm tra"}
              </button>

              <div className="resend-options">
                <p>Không nhận được mã?</p>
                <a onClick={handleSendOTP}>Gửi lại mã</a> |{" "}
                <a href="/forget-password">Đổi email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
