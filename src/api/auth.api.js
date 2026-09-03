import api from "./axios"

//Register
export const registerUser = async (userData) => {
  const response = await api.post("/auth/registers", userData);

  return response.data;
};

//login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

//logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

//get current user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/current-users");

  return response.data;
};

//refresh access token
export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh-token");

  return response.data;
};

//Change password
export const changePassword = async (passwordData) => {
  const response = await api.patch("/auth/change-password", passwordData);

  return response.data;
};