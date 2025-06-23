// src/services/LikeService.js
import api from "../interceptor/axiosAuth";

// Gửi yêu cầu toggle like
export const toggleLike = (audioBookId) =>
  api.post("/likes", { audioBookId });
