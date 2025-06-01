import axios from "axios";
const REST_API_BASE_URL_AUDIOBOOK = "http://localhost:8080/audiobooks";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("token: ", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// get all employees
export const listAudioBook = () =>
  axios.get(REST_API_BASE_URL_AUDIOBOOK, {
    headers: getAuthHeaders(),
  });
// add a employee
export const addAudiobook = (audiobook) =>
  axios.post(REST_API_BASE_URL_AUDIOBOOK, audiobook, {
    headers: getAuthHeaders(),
  });
// get by id
export const getAudiobookById = (id) =>
  axios.get(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`, {
    headers: getAuthHeaders(),
  });

// update
export const updateAudiobook = (id, audioBook) =>
  axios.put(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`, audioBook, {
    headers: getAuthHeaders(),
  });

// delete
export const deleteAudiobook = (id) =>
  axios.delete(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`, {
    headers: getAuthHeaders(),
  });
