import axios from "axios";

const REST_API_BASE_URL_SEARCH = `${import.meta.env.VITE_API_BASE_URL}/audiobooks`;

export const search = (keyword, page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_SEARCH}/search`, {
    params: { keyword, page, size },
  });

export const filterCategory = (id, page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_SEARCH}/filter/category/${id}`, {
    params: { page, size },
  });
