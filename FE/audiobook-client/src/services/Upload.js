import axios from "axios";

const REST_API_BASE_URL_UPLOAD = `${import.meta.env.VITE_API_BASE_URL}/upload`;

// Upload avatar người dùng
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "audiobook/avatars/users");

  return axios.post(`${REST_API_BASE_URL_UPLOAD}/user/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};