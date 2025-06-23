// src/services/ListenService.js
import api from "../interceptor/axiosAuth";

export const increaseView = (audioBookId) =>
  api.post(`/listen/${audioBookId}`);

export const saveListeningHistory = (audioBookId) =>
  api.post(`/listen/${audioBookId}/history`);

export const getAllFromHistory = () =>
  api.get("/listen");
