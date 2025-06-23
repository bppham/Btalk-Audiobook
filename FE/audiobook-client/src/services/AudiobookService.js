import api from "../interceptor/axiosAuth"; // Đã có interceptor gắn token + refresh
const REST_API_BASE_URL_AUDIOBOOK = "/audiobooks"; // Gọn hơn khi baseURL đã cấu hình sẵn

// ✅ Lấy danh sách toàn bộ audiobook (public)
export const listAudioBook = () => api.get(REST_API_BASE_URL_AUDIOBOOK);

// ✅ Lấy chi tiết audiobook theo id (cần token nếu API yêu cầu)
export const getAudiobookById = (id) =>
  api.get(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`);
