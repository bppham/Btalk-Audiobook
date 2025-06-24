import api from "../interceptor/axiosAuth";
import apiBase from "../interceptor/axiosBase";
const REST_API_BASE_URL_AUDIOBOOK = `${
  import.meta.env.VITE_API_BASE_URL
}/audiobooks`;
// get all employees
export const listAudioBook = () => apiBase.get(REST_API_BASE_URL_AUDIOBOOK);
// add a employee
export const addAudiobook = (audiobook) =>
  api.post(REST_API_BASE_URL_AUDIOBOOK, audiobook);
// get by id
export const getAudiobookById = (id) =>
  api.get(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`);

// update
export const updateAudiobook = (id, audioBook) =>
  api.put(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`, audioBook);

// delete
export const deleteAudiobook = (id) =>
  api.delete(`${REST_API_BASE_URL_AUDIOBOOK}/${id}`);
