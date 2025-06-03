import axios from "axios";

const REST_API_BASE_URL_LIBRARY = "http://localhost:8080/libraries";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllFromLibrary = () =>
  axios.get(REST_API_BASE_URL_LIBRARY, { headers: getAuthHeaders() });

export const saveToLibrary = (audioBookId) =>
  axios.post(
    `${REST_API_BASE_URL_LIBRARY}/save`,
    { audioBookId },
    { headers: getAuthHeaders() }
  );

export const removeFromLibrary = (audioBookId) =>
  axios.post(
    `${REST_API_BASE_URL_LIBRARY}/remove`,
    { audioBookId },
    { headers: getAuthHeaders() }
  );
