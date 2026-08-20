import api from "./axios";

// Get all users - Admin only
export const getAllUsers = async ()=> {
    const response = await api.get("/users/all-users");

    return response.data;
 };

// Get user by ID - Admin only
export const getUserById = async (userid) => {
    const response = await api.get(`/users/${userid}/users`);

    return response.data;
 };

// Update user status - Admin only
 export const updateUserStatus = async (userid, isActive) => {
   const response = await api.patch(`/users/${userid}/status`,
      {
         isActive,
      }
   );

   return response.data;
 };

 // Update user role - Admin only
 export const updateUserRole = async (userid, role) => {
   const response = await api.patch(`/users/${userid}/roles`,
      {
         role,
      }
   );

   return response.data;
 };

// Update current user's profile
 export const updateProfile = async (profileData) => {
    const response = await api.patch("/users/update-profile", profileData);

    return response.data;
 };
