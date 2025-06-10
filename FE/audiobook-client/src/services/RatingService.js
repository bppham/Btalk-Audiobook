import axios from "axios";

const REST_API_BASE_URL_RATING = `${import.meta.env.VITE_API_BASE_URL}/ratings`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ratingAudiobook = (audioBookId, value) =>
  axios.post(
    REST_API_BASE_URL_RATING,
    { audioBookId, value },
    { headers: getAuthHeaders() }
  );
