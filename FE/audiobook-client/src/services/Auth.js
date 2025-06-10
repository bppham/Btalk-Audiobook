import axios from "axios";
const REST_API_BASE_URL_AUTH = `${import.meta.env.VITE_API_BASE_URL}/user/auth`;

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
// forget password
export const forgetPassword = async (email) => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL_AUTH}/forget-password`,
      { email }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
// verify code
export const verifyCode = async (email, otp) => {
  try {
    const response = await axios.post(
      `${REST_API_BASE_URL_AUTH}/verify-code`,
      { email, code: otp }
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};
export const resetPassword = async (email, password) => {
  try {
    const response = await axios.put(
      `${REST_API_BASE_URL_AUTH}/reset-password`,
      { email, password}
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};