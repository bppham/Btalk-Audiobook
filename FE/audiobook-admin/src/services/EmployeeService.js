import axios from "axios";
const REST_API_BASE_URL_EMPLOYEE = `${import.meta.env.VITE_API_BASE_URL}/employees`;
const REST_API_BASE_URL_ROLES = `${import.meta.env.VITE_API_BASE_URL}/roles`;
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("token: ", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// get all employees
export const listEmployee = () =>
  axios.get(REST_API_BASE_URL_EMPLOYEE, {
    headers: getAuthHeaders(),
  });
// delete
export const deleteEmployee = (id) =>
  axios.delete(REST_API_BASE_URL_EMPLOYEE + "/" + id, {
    headers: getAuthHeaders(),
  });
// get all roles
export const listRole = () =>
  axios.get(REST_API_BASE_URL_ROLES, {
    headers: getAuthHeaders(),
  });
// add employee
export const addEmployee = (request) =>
  axios.post(REST_API_BASE_URL_EMPLOYEE, request, {
    headers: getAuthHeaders(),
  });
// get by id
export const getEmployeeById = (id) =>
  axios.get(REST_API_BASE_URL_EMPLOYEE + "/" + id, {
    headers: getAuthHeaders(),
  });
// update an employee
export const updateEmployee = (id, request) =>
  axios.put(`${REST_API_BASE_URL_EMPLOYEE}/${id}`, request, {
    headers: getAuthHeaders(),
  });
