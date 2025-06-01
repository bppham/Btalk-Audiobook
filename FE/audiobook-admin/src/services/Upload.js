import axios from "axios";

const REST_API_BASE_URL_UPLOAD = "http://localhost:8080/upload";

export const uploadBookCover = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${REST_API_BASE_URL_UPLOAD}/audiobook/cover`, formData, {
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

  return axios.post(
    `${REST_API_BASE_URL_UPLOAD}/audiobook/audio-files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
