import axios from "axios";

const REST_API_BASE_URL_AUTHOR = "http://localhost:8080/authors";

// Hàm lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("token: ", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET all authors (cần token vì Spring yêu cầu authenticated())
export const listAuthors = () => axios.get(REST_API_BASE_URL_AUTHOR);

// ADD author
export const addAuthor = (author) =>
  axios.post(REST_API_BASE_URL_AUTHOR, author, {
    headers: getAuthHeaders(),
  });

// GET author by ID
export const getAuthor = (authorId) =>
  axios.get(`${REST_API_BASE_URL_AUTHOR}/${authorId}`, {
    headers: getAuthHeaders(),
  });

// UPDATE author
export const updateAuthor = (authorId, author) =>
  axios.put(`${REST_API_BASE_URL_AUTHOR}/${authorId}`, author, {
    headers: getAuthHeaders(),
  });

// DELETE author
export const deleteAuthor = (authorId) =>
  axios.delete(`${REST_API_BASE_URL_AUTHOR}/${authorId}`, {
    headers: getAuthHeaders(),
  });
