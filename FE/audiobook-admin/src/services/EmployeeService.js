import api from "../interceptor/axiosAuth";
const REST_API_BASE_URL_EMPLOYEE = `${
  import.meta.env.VITE_API_BASE_URL
}/employees`;
const REST_API_BASE_URL_ROLES = `${import.meta.env.VITE_API_BASE_URL}/roles`;
// get all employees
export const listEmployee = () => api.get(REST_API_BASE_URL_EMPLOYEE);
// delete
export const deleteEmployee = (id) =>
  api.delete(REST_API_BASE_URL_EMPLOYEE + "/" + id);
// get all roles
export const listRole = () => api.get(REST_API_BASE_URL_ROLES);
// add employee
export const addEmployee = (request) =>
  api.post(REST_API_BASE_URL_EMPLOYEE, request);
// get by id
export const getEmployeeById = (id) =>
  api.get(REST_API_BASE_URL_EMPLOYEE + "/" + id);
// update an employee
export const updateEmployee = (id, request) =>
  api.put(`${REST_API_BASE_URL_EMPLOYEE}/${id}`, request);
