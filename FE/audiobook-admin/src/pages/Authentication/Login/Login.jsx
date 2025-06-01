import { useState } from "react";
import "./Login.css";
import sub_img_1 from "../../../assets/login-sub-img1.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/AuthService";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await login(email, password);

      if (response.code === 1000) {
        const token = response.result.token;
        localStorage.setItem("token", token);

        // ✅ Giải mã token để lấy roles
        const decoded = jwtDecode(token);
        const roles = decoded.roles;

        // ✅ Lưu email, name, roles (tùy frontend cần gì)
        localStorage.setItem("email", decoded.sub); // Hoặc response.email nếu backend trả
        localStorage.setItem("name", response.name); // Nếu backend trả riêng
        localStorage.setItem("roles", JSON.stringify(roles)); // Đã đúng

        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setError("Email or password incorrect: ", err);
    }
  };

  return (
    <div className="login-admin">
      <div className="login-container">
        <div className="login-info">
          <h3>This is the login page for BTalk audiobook management</h3>
          <div className="info-description">
            <li>Use your email and password to log in</li>
            <li>If you forget your password, click "Forgot password"</li>
            <li>If you don’t have an account, please contact admin</li>
          </div>
          <img src={sub_img_1} alt="login info" />
        </div>

        <div className="login-section">
          <h1>LOGIN</h1>
          <div className="login-section-container">
            <div className="item">
              <label>Email:</label>
              <input
                placeholder="example@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="item">
              <label>Password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your account password ..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="forget-password-item">
              <p onClick={() => navigate("/auth/forget-password")}>
                Forget password?
              </p>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div className="login-action">
            <button onClick={handleLogin}>LOGIN</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
