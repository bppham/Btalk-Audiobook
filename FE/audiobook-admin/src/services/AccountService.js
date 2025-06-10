import axios from "axios";

const REST_API_BASE_URL_EMPLOYEE = `${import.meta.env.VITE_API_BASE_URL}/employee/info`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getEmployeeInfo = () =>
  axios.get(`${REST_API_BASE_URL_EMPLOYEE}`, {
    headers: getAuthHeaders(),
  });

export const updateInfo = (request) =>
  axios.put(`${REST_API_BASE_URL_EMPLOYEE}/update`, request, {
    headers: getAuthHeaders(),
  });

  export const changePassword = (request) =>
  axios.put(`${REST_API_BASE_URL_EMPLOYEE}/change-password`, request, {
    headers: getAuthHeaders(),
  });