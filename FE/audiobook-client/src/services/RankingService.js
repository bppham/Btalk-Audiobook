// src/services/RankingService.js
import api from "../interceptor/axiosBase";

export const getTopByDay = (date, page = 0, size = 10) =>
  api.get("/ranking/day", {
    params: { date, page, size },
  });

export const getTopByMonth = (month, page = 0, size = 10) =>
  api.get("/ranking/month", {
    params: { month, page, size },
  });

export const getTopByYear = (year, page = 0, size = 10) =>
  api.get("/ranking/year", {
    params: { year, page, size },
  });

export const getTopByAll = (page = 0, size = 10) =>
  api.get("/ranking/all", {
    params: { page, size },
  });

export const getTopByLikes = (page = 0, size = 10) =>
  api.get("/ranking/likes", {
    params: { page, size },
  });

export const getTopByRating = (page = 0, size = 10) =>
  api.get("/ranking/rating", {
    params: { page, size },
  });
