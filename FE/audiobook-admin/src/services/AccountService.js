import api from "../interceptor/axiosAuth";

const REST_API_BASE_URL_EMPLOYEE = `${
  import.meta.env.VITE_API_BASE_URL
}/employee/info`;

export const getEmployeeInfo = () => api.get(`${REST_API_BASE_URL_EMPLOYEE}`);

export const updateInfo = (request) =>
  api.put(`${REST_API_BASE_URL_EMPLOYEE}/update`, request);

export const changePassword = (request) =>
  api.put(`${REST_API_BASE_URL_EMPLOYEE}/change-password`, request);
