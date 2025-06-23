// src/services/SearchService.js
import api from "../interceptor/axiosBase";

export const search = (keyword, page = 0, size = 10) =>
  api.get("/audiobooks/search", {
    params: { keyword, page, size },
  });

export const filterCategory = (id, page = 0, size = 10) =>
  api.get(`/audiobooks/filter/category/${id}`, {
    params: { page, size },
  });
