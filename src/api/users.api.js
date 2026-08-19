import api from "./axios";


export const getAllUsers = async ()=> {
    const response = await api.get("/users/all-users");

    return response.data;
 };


export const getUserById = async (userid) => {
    const response = await api.get(`/users/${userid}/users`);

    return response.data;
 };


 export const updateUserStatus = async (userid, isActive) => {
   const response = await api.patch(`/users/${userid}/status`,
      {
         isActive,
      }
   );

   return response.data;
 };

 export const updateUserRole = async (userid, role) => {
   const response = await api.patch(`/users/${userid}/roles`,
      {
         role,
      }
   );

   return response.data;
 };

// UPDATE PROFILE
// Current logged-in user (Only)
 export const updateProfile = async (profileData) => {
    const response = await api.patch("/users/update-profile", profileData);

    return response.data;
 };
