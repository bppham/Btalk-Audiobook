import { createContext, useContext, useEffect, useState } from "react";
import { getUserInfo } from "../services/UserService";
import { logout as logoutAPI} from "../services/Auth";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getUserInfo()
        .then((res) => {
          setUser(res.data.result);
        })
        .catch((err) => {
          console.warn("Get user failed:", err);
          // ❗ KHÔNG xóa token ở đây
          // Đợi interceptor xử lý refresh. Nếu thất bại thật sự (ví dụ do /refresh trả lỗi),
          // bạn có thể logout ở đó (ví dụ: trong interceptor hoặc sau này thêm retry logic)
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await logoutAPI(); 
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
