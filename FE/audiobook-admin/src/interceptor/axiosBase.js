// interceptor/axiosBase.js
import axios from "axios";

const apiBase = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // chỉ dùng nếu cần cookie (VD: login)
});

export default apiBase;
