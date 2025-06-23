import api from "../interceptor/axiosAuth";

export const getUserInfo = () => api.get("/user/info");

export const updateInfo = (request) =>
  api.put("/user/info/update", request);

export const changePassword = (request) =>
  api.put("/user/info/change-password", request);