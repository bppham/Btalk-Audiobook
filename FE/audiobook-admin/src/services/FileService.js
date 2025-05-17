import axios from "axios";

const REST_API_BASE_URL_FILE = "http://localhost:8080/files";

// Hàm gọi API lấy ảnh
export const getImage = (fileName) => {
  return axios.get(`${REST_API_BASE_URL_FILE}/${fileName}`, {
    responseType: "blob",
  });
};
