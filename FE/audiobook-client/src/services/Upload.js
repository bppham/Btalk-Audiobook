// src/services/UploadService.js
import api from "../interceptor/axiosBase";

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "audiobook/avatars/users");

  return api.post("/upload/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
