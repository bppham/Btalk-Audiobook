import { useState } from "react";
import "./ForgetPassword.css";
import sub_img_1 from "../../../assets/login-sub-img1.png";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../../services/AuthService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgetPassword = async () => {
    if (email.length === 0) {
      toast.error("Can not let your email field empty");
      return;
    }
    try {
      const response = await forgetPassword(email);
      if (response.code === 1000) {
        toast.success("Success");
        sessionStorage.setItem("email", email);
        navigate("/auth/verify-code");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="forget-password-admin">
      <ToastContainer />
      <div className="forget-password-container">
        <div className="forget-password-info">
          <h3>This is the forget password page</h3>
          <div className="info-description">
            <li>Input your email for your account</li>
            <li>Then click "CONTINUE"</li>
            <li>Check your email</li>
          </div>
          <img src={sub_img_1} alt="forget-password info" />
        </div>

        <div className="forget-password-section">
          <h2>Your account email</h2>
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
            <button onClick={handleForgetPassword}>CONTINUE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
