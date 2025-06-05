import axios from "axios";

const REST_API_BASE_URL_RANKING = "http://localhost:8080/ranking";

export const getTopByDay = (date, page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_RANKING}/day`, {
    params: { date, page, size },
  });

export const getTopByMonth = (month, page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_RANKING}/month`, {
    params: { month, page, size },
  });

export const getTopByYear = (year, page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_RANKING}/year`, {
    params: { year, page, size },
  });

export const getTopByAll = (page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_RANKING}/all`, {
    params: { page, size },
  });

export const getTopByLikes = (page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_RANKING}/likes`, {
    params: { page, size },
  });

export const getTopByRating = (page = 0, size = 10) =>
  axios.get(`${REST_API_BASE_URL_RANKING}/rating`, {
    params: { page, size },
  });
