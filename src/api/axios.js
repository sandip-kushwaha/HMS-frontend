import axios from "axios";

const  api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    //Send cookies along with requests to my backend.(cross-origin requests)
    withCredentials: true,
    //send JSON data
    headers:{
        "Content-Type": "application/json",
    },
});

//---Axios Interceptor
let isRefreshing = false;

let failedQueue = [];

//Process the waiting requests
const processQueue = (error) => {
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
    //success response
  (response) => {
    return response;
  },
//Error response
  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {

      originalRequest._retry = true;

      // If another refresh request is already running
      if (isRefreshing) {
        //wait the request
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });

        }).then(() => {
          return api(originalRequest);
        });
      }


      isRefreshing = true;

      try {
        // Refresh token cookie automatically sent
        await api.post("/auth/refresh-token");

        //Refresh successful
        //Release waiting requests 
        processQueue(null);

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

    return Promise.reject(error);

  }
);


export default api;