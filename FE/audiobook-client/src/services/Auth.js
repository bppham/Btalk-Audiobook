import axios from "axios";
const REST_API_BASE_URL_AUTH = "http://localhost:8080/user/auth";
// register
export const register = (request) =>
  axios.post(REST_API_BASE_URL_AUTH + "/register", request);
// login
export const login = async (request) => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL_AUTH}/login`,
      request
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// login with google
export const loginWithGoogle = async (idToken, name, photoURL) => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL_AUTH}/loginWithGoogle`,
      {
        idToken,
        name,
        photoURL,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
