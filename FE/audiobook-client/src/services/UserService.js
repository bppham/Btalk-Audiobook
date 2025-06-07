import axios from "axios";

const REST_API_BASE_URL_USER = "http://localhost:8080/user/info";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUserInfo = () =>
  axios.get(`${REST_API_BASE_URL_USER}`, {
    headers: getAuthHeaders(),
  });

export const updateInfo = (request) =>
  axios.put(`${REST_API_BASE_URL_USER}/update`, request, {
    headers: getAuthHeaders(),
  });

  export const changePassword = (request) =>
  axios.put(`${REST_API_BASE_URL_USER}/change-password`, request, {
    headers: getAuthHeaders(),
  });