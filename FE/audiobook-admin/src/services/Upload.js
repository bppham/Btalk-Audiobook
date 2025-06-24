import api from "../interceptor/axiosBase";

const REST_API_BASE_URL_UPLOAD = `${import.meta.env.VITE_API_BASE_URL}/upload`;

export const uploadBookCover = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`${REST_API_BASE_URL_UPLOAD}/audiobook/cover`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadAudioFiles = async (fileObjects) => {
  const formData = new FormData();
  fileObjects.forEach((obj, index) => {
    formData.append("audioFiles", obj.file);
    formData.append("fileNames", obj.customName); // tên tương ứng
  });

  return api.post(
    `${REST_API_BASE_URL_UPLOAD}/audiobook/audio-files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Upload avatar người dùng
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "audiobook/avatars/employees");

  return api.post(`${REST_API_BASE_URL_UPLOAD}/user/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
