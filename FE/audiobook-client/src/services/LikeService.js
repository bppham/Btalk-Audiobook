import axios from "axios";

const REST_API_BASE_URL_LIKE = "http://localhost:8080/likes";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Gửi yêu cầu toggle like
export const toggleLike = (audioBookId) =>
  axios.post(
    REST_API_BASE_URL_LIKE,
    { audioBookId },
    { headers: getAuthHeaders() }
  );
