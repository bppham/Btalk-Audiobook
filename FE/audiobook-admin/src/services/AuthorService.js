import api from "../interceptor/axiosAuth";
import apiBase from "../interceptor/axiosBase";

const REST_API_BASE_URL_AUTHOR = `${import.meta.env.VITE_API_BASE_URL}/authors`;

// GET all authors (cần token vì Spring yêu cầu authenticated())
export const listAuthors = () => apiBase.get(REST_API_BASE_URL_AUTHOR);

// ADD author
export const addAuthor = (author) => api.post(REST_API_BASE_URL_AUTHOR, author);

// GET author by ID
export const getAuthor = (authorId) =>
  api.get(`${REST_API_BASE_URL_AUTHOR}/${authorId}`);

// UPDATE author
export const updateAuthor = (authorId, author) =>
  api.put(`${REST_API_BASE_URL_AUTHOR}/${authorId}`, author);

// DELETE author
export const deleteAuthor = (authorId) =>
  api.delete(`${REST_API_BASE_URL_AUTHOR}/${authorId}`);
