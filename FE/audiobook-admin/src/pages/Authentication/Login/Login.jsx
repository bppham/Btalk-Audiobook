import { useState } from "react";
import "./Login.css";
import sub_img_1 from "../../../assets/login-sub-img1.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/AuthService";
import { useAuth } from "../../../context/AuthContext";
import { getEmployeeInfo } from "../../../services/AccountService";
import LoadingOverlay from "../../../components/LoadingOverlay/LoadingOverlay";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const request = {
        email,
        password
      };
      const response = await login(request);

      if (response.code === 1000) {
        const token = response.result.token;
        localStorage.setItem("token", token);
        const responseUserInfo = await getEmployeeInfo();
        if (responseUserInfo.data.code === 1000) {
          toast.success("Login done");
          setUser(responseUserInfo.data.result);
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Email or password is not correct");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-admin">
      <ToastContainer position="top-right" autoClose={3000} />
      {loading && <LoadingOverlay />}
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
