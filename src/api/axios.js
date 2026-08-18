import axios from "axios";

const  api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    //Send cookies along with requests to my backend.(cross-origin requests)
    withCredentials: true,
    //send JSON data
    headers:{
        "Content-Type": "aplication/json",
    },
});

export default api;