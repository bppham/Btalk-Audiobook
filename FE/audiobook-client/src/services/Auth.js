import apiBase from "../interceptor/axiosBase"; 
import api from "../interceptor/axiosAuth";  

const REST_API_BASE_URL_AUTH = "/user/auth"; // dùng relative path cho gọn

// ✅ Đăng ký
export const register = (request) =>
  apiBase.post(`${REST_API_BASE_URL_AUTH}/register`, request);

// ✅ Đăng nhập
export const login = async (request) => {
  const response = await apiBase.post(
    `${REST_API_BASE_URL_AUTH}/login`,
    request,
    { withCredentials: true } // để backend set cookie
  );
  return response.data;
};

// ✅ Đăng nhập bằng Google
export const loginWithGoogle = async (idToken, name, photoURL) => {
  const response = await apiBase.post(
    `${REST_API_BASE_URL_AUTH}/loginWithGoogle`,
    { idToken, name, photoURL },
    { withCredentials: true }
  );
  return response.data;
};

// ✅ Gửi email quên mật khẩu
export const forgetPassword = async (email) => {
  const response = await apiBase.post(
    `${REST_API_BASE_URL_AUTH}/forget-password`,
    { email }
  );
  return response.data;
};

// ✅ Xác thực mã OTP
export const verifyCode = async (email, otp) => {
  const response = await apiBase.post(
    `${REST_API_BASE_URL_AUTH}/verify-code`,
    { email, code: otp }
  );
  return response.data;
};

// ✅ Đặt lại mật khẩu mới
export const resetPassword = async (email, password) => {
  const response = await apiBase.put(
    `${REST_API_BASE_URL_AUTH}/reset-password`,
    { email, password }
  );
  return response.data;
};

// ✅ Đăng xuất
export const logout = async () => {
  return await api.post(
    `${REST_API_BASE_URL_AUTH}/logout`,
    {}, // body rỗng
    { withCredentials: true } // để gửi cookie chứa refreshToken
  );
};
