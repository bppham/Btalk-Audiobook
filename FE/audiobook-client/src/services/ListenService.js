import axios from "axios";

const REST_API_BASE_URL_LISTEN = "http://localhost:8080/listen";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const increaseView = (audioBookId) =>
  axios.post(`${REST_API_BASE_URL_LISTEN}/${audioBookId}`, {}, {});

export const saveListeningHistory = (audioBookId) =>
  axios.post(
    `${REST_API_BASE_URL_LISTEN}/${audioBookId}/history`,
    {},
    { headers: getAuthHeaders() }
  );

export const getAllFromHistory = () =>
  axios.get(REST_API_BASE_URL_LISTEN, { headers: getAuthHeaders() });
