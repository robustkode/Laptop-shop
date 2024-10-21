import Axios from "axios";
import { config } from "dotenv";
config();

export const apiClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: "http://localhost:3000/api",
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message;

    // Check if the error has a response
    if (error.response) {
      // Handle server errors
      message =
        error.response.data.error?.message ||
        "An unknown server error occurred";
    } else if (error.request) {
      // Handle request made but no response received
      message = "No response received from the server";
    } else {
      // Handle other types of errors (e.g., setup errors)
      error = error.message || "An unexpected error occurred.";
    }

    // Handle network errors specifically
    if (error.message === "Network Error") {
      errorMessage = "Please check your internet connection.";
    }

    return Promise.reject(new Error(message));
  }
);
