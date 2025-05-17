import React, { useRef, useState, useEffect } from "react";
import sub_img_1 from "../../../assets/login-sub-img1.png";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { resetPassword } from "../../../services/AuthService";
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
      navigate("/auth/login");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleResetPassword = async () => {
    if (password === "" || retypePassword === "") {
      toast.error("Please fill all the information");
      return;
    } else if (password.length < 6) {
      toast.error("Password must have at least 6 characters");
      return;
    } else if (password !== retypePassword) {
      toast.error("Retype password is not correct");
      return;
    }
    try {
      setLoading(true);
      const response = await resetPassword(email, password);
      if (response.code === 1000) {
        toast.success("Your new password has been resetted");
        sessionStorage.removeItem("email");
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }
    } catch (error) {
      toast.error(error || "Something wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-admin">
      <ToastContainer />
      <div className="reset-password-container">
        <div className="reset-password-info">
          <h3>This is the reset password page</h3>
          <div className="info-description">
            <li>Create new password for your account</li>
            <li>Retype password must be as same as your new password</li>
            <li>After that, you can go back to login to admin page</li>
          </div>
          <img src={sub_img_1} alt="reset-password info" />
        </div>

        <div className="reset-password-section">
          <h2>RESET PASSWORD</h2>
          <div className="reset-password-section-container">
            <div className="item">
              <label>New password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Your new password ..."
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="item">
              <label>Retype password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={retypePassword}
                  placeholder="Your retype password ..."
                  onChange={(e) => setRetypePassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div className="reset-password-action">
            <button onClick={handleResetPassword}>CONFIRM</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
