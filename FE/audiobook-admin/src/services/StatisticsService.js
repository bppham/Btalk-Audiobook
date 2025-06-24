import api from "../interceptor/axiosAuth";
const REST_API_BASE_URL_STATISTICS = `${
  import.meta.env.VITE_API_BASE_URL
}/statistics`;
// get total users
export const getTotalUsers = () =>
  api.get(`${REST_API_BASE_URL_STATISTICS}/user/count`);

// get total audiobooks
export const getTotalAudiobooks = () =>
  api.get(`${REST_API_BASE_URL_STATISTICS}/audiobook/count`);

// get all listens count
export const getAllListensCountThisYear = () =>
  api.get(`${REST_API_BASE_URL_STATISTICS}/audiobook/listen-count/yearly`);

// get all listens count monthly
export const getAllMonthListenCount = () =>
  api.get(`${REST_API_BASE_URL_STATISTICS}/audiobook/listen-count/by-month`);
