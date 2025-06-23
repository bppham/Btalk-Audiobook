import api from "../interceptor/axiosAuth";

export const getAllFromLibrary = () =>
  api.get("/libraries");

export const saveToLibrary = (audioBookId) =>
  api.post("/libraries/save", { audioBookId });

export const removeFromLibrary = (audioBookId) =>
  api.post("/libraries/remove", { audioBookId });

