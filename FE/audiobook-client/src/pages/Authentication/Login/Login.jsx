import React, { useState } from "react";
import "./Login.css";
import ic_google from "../../../assets/auth/icon_google.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../config/firebase-config";
import { login } from "../../../services/Auth";
import { loginWithGoogle } from "../../../services/Auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserInfo } from "../../../services/UserService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // TODO: Thêm logic đăng nhập ở đây
    const request = {
      email: email,
      password: password,
    };
    try {
      const response = await login(request);
      if (response.code === 1000) {
        localStorage.setItem("token", response.result.token);
        const responseUserInfo = await getUserInfo();
        setUser(responseUserInfo.data.result);
        toast.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Đăng nhập thất bại!");
    }
  };

  const provider = new GoogleAuthProvider();
  provider.addScope("profile");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.idToken; // <-- Đây mới là Google ID Token bạn cần gửi lên backend
      const user = result.user;
      const name = user.displayName;
      const photoURL = user.photoURL;
      // Gửi token này về Spring Boot backend
      const response = await loginWithGoogle(idToken, name, photoURL);
      console.log(response);
      if (response.code === 1000) {
        console.log("JWT từ backend:", response);
        localStorage.setItem("token", response.result.token);
        const responseUserInfo = await getUserInfo();
        setUser(responseUserInfo.data.result);
        toast.success("Đăng nhập thành công");
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Đăng nhập bằng Google thất bại!");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="auth-box">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="auth-links">
            <a href="/forget-password">Quên mật khẩu?</a>
          </div>
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>

        <div className="separator">hoặc</div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src={ic_google} alt="Google logo" className="google-logo" />
          Đăng nhập với Google
        </button>

        <div className="register-link">
          <span>Chưa có tài khoản?</span> <a href="/register">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
