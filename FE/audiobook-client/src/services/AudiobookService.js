import axios from "axios";
const REST_API_BASE_URL_AUDIOBOOK = `${import.meta.env.VITE_API_BASE_URL}/audiobooks`;
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// get all categories
export const listAudioBook = () => axios.get(REST_API_BASE_URL_AUDIOBOOK);
// get by id
export const getAudiobookById = (id) =>
  axios.get(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`, {
    headers: getAuthHeaders(),
  });
