import axios from "axios";
const REST_API_BASE_URL_VOICE = "http://localhost:8080/voices";
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("token: ", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// get all voices
export const listVoices = () =>
  axios.get(REST_API_BASE_URL_VOICE, {
    headers: getAuthHeaders(),
  });
// add a voice
export const addVoice = (voice) => axios.post(REST_API_BASE_URL_VOICE, voice);
// get voice by id
export const getVoice = (voiceId) =>
  axios.get(REST_API_BASE_URL_VOICE + "/" + voiceId);
// update
export const updateVoice = (voiceId, voice) =>
  axios.put(REST_API_BASE_URL_VOICE + "/" + voiceId, voice);
// delete
export const deleteVoice = (voiceId) =>
  axios.delete(REST_API_BASE_URL_VOICE + "/" + voiceId);
