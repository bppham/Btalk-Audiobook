import axios from "axios";
const REST_API_BASE_URL_STATISTICS = "http://localhost:8080/statistics";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// get total users
export const getTotalUsers = () =>
  axios.get(`${REST_API_BASE_URL_STATISTICS}/user/count`, {
    headers: getAuthHeaders(),
  });

// get total audiobooks
export const getTotalAudiobooks = () =>
  axios.get(`${REST_API_BASE_URL_STATISTICS}/audiobook/count`, {
    headers: getAuthHeaders(),
  });

// get all listens count
export const getAllListensCountThisYear = () =>
  axios.get(`${REST_API_BASE_URL_STATISTICS}/audiobook/listen-count/yearly`, {
    headers: getAuthHeaders(),
  });

// get all listens count monthly
export const getAllMonthListenCount = () =>
  axios.get(`${REST_API_BASE_URL_STATISTICS}/audiobook/listen-count/by-month`, {
    headers: getAuthHeaders(),
  });
