import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Send cookies with requests
  withCredentials: true,
  // JSON by default
  headers: {
    "Content-Type": "application/json",
  },
});


// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  // If sending FormData/image
  // let browser set multipart/form-data automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});


// RESPONSE INTERCEPTOR

let isRefreshing = false;
let failedQueue = [];

// Release waiting requests
const processQueue = (error = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  }); 

  failedQueue = [];
};

api.interceptors.response.use(
  
  // SUCCESS
  (response) => {
    return response;
  },

  // ERROR
  async (error) => {
    const originalRequest = error.config;

    // Only handle expired authentication
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      
      // REFRESH ALREADY RUNNING
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then(() => {
          // Refresh completed
          // Retry original request
          return api(originalRequest);
        });
      }


      // START REFRESH
      isRefreshing = true;

      try {
        // Refresh token cookie is
        // automatically sent
        await api.post("/auth/refresh-token");

        // Refresh successful
        processQueue();

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed
        processQueue(refreshError);

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }
    // Other errors
    return Promise.reject(error);
  },
);

export default api;