import axios from "axios";
import { displayToast } from "../layouts/displayToast";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

// Fungsi untuk melakukan GET request
export const getApiData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      withXSRFToken: true,
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error, misalnya log atau tampilkan pesan kesalahan
    console.error("Error in API request:", error);
    throw error; // Rethrow error agar dapat ditangkap oleh pemanggil fungsi
  }
};

// Fungsi untuk melakukan POST request
export const postApiData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      withXSRFToken: true,
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });
    displayToast({
      icon: "success",
      title: response.data.message,
    });
    return response.data;
  } catch (error) {
    displayToast({
      icon: "error",
      title: error.response.data.message,
    });
    throw error;
  }
};
