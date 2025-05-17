import React, { useRef, useState, useEffect } from "react";
import "./VerifyCode.css";
import sub_img_1 from "../../../assets/login-sub-img1.png";
import { useNavigate } from "react-router-dom";
import { forgetPassword, verifyCode } from "../../../services/AuthService";
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
      navigate("/auth/forget-password");
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
      toast.error("OTP is expired");
      return;
    }

    const enteredOTP = otp.join("");
    if (enteredOTP.length !== 6) {
      toast.error("Please fill all 6 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyCode(email, enteredOTP);

      if (response.code === 1000) {
        toast.success("Code is correct");
        setTimeout(() => {
          navigate("/auth/reset-password");
        }, 3000);
      } else {
        toast.error("OTP verification failed");
      }
    } catch (error) {
      toast.error(error.message || "OTP is invalid");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await forgetPassword(email);
      if (response.code === 1000) {
        toast.success("Resend code successfully!");
        setTimeLeft(120);
        setExpired(false);
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Can not resend code");
    }
  };

  return (
    <div className="verify-code-admin">
      <ToastContainer />
      <div className="verify-code-container">
        <div className="verify-code-info">
          <h3>This is the verify code page</h3>
          <div className="info-description">
            <li>Check your email for the code, then type it</li>
            <li>Click "CONTINUE" to go on</li>
            <li>Resend the code if your code is expired</li>
            <li>Change your email if you do not sure your email was right</li>
          </div>
          <img src={sub_img_1} alt="verify-code info" />
        </div>

        <div className="verify-code-section">
          <div className="verify-code-section-container">
            <div className="verify-otp-card">
              <h3>Verify code</h3>
              <p>(Check your email)</p>

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
                  Verify code expired in: <span>{formatTime(timeLeft)}</span>
                </p>
              </div>

              <button
                className="verify-btn"
                onClick={handleVerifyOTP}
                disabled={expired || loading}
              >
                {loading
                  ? "Checking ..."
                  : expired
                  ? "Your code is expired"
                  : "Verify"}
              </button>

              <div className="resend-options">
                <p>Do not see your verify code?</p>
                <a onClick={handleSendOTP}>Resend verify code</a> |{" "}
                <a href="/auth/forget-password">Change email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
