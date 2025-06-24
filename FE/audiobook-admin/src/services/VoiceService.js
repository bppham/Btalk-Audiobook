import apiBase from "../interceptor/axiosBase";
import api from "../interceptor/axiosAuth";
const REST_API_BASE_URL_VOICE = `${import.meta.env.VITE_API_BASE_URL}/voices`;
// get all voices
export const listVoices = () => apiBase.get(REST_API_BASE_URL_VOICE);
// add a voice
export const addVoice = (voice) => api.post(REST_API_BASE_URL_VOICE, voice);
// get voice by id
export const getVoice = (voiceId) =>
  api.get(REST_API_BASE_URL_VOICE + "/" + voiceId);
// update
export const updateVoice = (voiceId, voice) =>
  api.put(REST_API_BASE_URL_VOICE + "/" + voiceId, voice);
// delete
export const deleteVoice = (voiceId) =>
  api.delete(REST_API_BASE_URL_VOICE + "/" + voiceId);
