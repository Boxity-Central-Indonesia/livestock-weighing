import axios from "axios";
import { displayToast } from "../layouts/displayToast";


const API_BASE_URL = import.meta.env.VITE_API_URL;

// Fungsi untuk melakukan GET request
export const getApiData = async (endpoint) => {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        withXSRFToken: true,
        headers: {
          Authorization: `Bearer 76|Qr1jmWJshiuV3hnGKuSv8OwHuJLtAMJ84pcFnc6I8dc7f81d`,
        }
      });
      return response.data;
    } catch (error) {
      // Handle error, misalnya log atau tampilkan pesan kesalahan
      console.error('Error in API request:', error);
      throw error; // Rethrow error agar dapat ditangkap oleh pemanggil fungsi
    }
  };



// Fungsi untuk melakukan POST request
export const postApiData = async (endpoint, data) => {
    try {
        const response = await axios.post(
          `${API_BASE_URL}${endpoint}`,
          data,
          {
            withXSRFToken: true,
            headers: {
              Authorization: `Bearer 76|Qr1jmWJshiuV3hnGKuSv8OwHuJLtAMJ84pcFnc6I8dc7f81d`,
            },
          }
        );
        displayToast({
          icon: "success",
          title: response.data.message,
        });
        return response.data;
      } catch (error) {
        displayToast({
          icon: "error",
          title: response.data.message,
        });
        throw error;
      }
  };