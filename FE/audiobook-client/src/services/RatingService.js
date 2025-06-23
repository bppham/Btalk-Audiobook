// src/services/RatingService.js
import api from "../interceptor/axiosAuth";

export const ratingAudiobook = (audioBookId, value) =>
  api.post("/ratings", {
    audioBookId,
    value,
  });
