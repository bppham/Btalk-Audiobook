import axios from "axios";
const REST_API_BASE_URL_AUTH = `${import.meta.env.VITE_API_BASE_URL}/admin/auth`;
// login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL_AUTH}/login`, {
      email,
      password,
    });
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