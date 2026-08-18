import api from "./axios";

export const getCurrentUser = async ()=> {
    const response = await api.get("/auth/current-users");

    return response.data;
}
