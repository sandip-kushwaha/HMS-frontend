import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";


const AuthContext = createContext(null);

 export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(null);

    //Get currently logged-in user
    const getCurrentUser = async ()=> {
    try {
        const response = await api.get("/auth/current-users");

        setUser(response.data.data)

      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    //Login
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
           email,
           password,
        });

        setUser(response.data.data.user);

        return response.data;
    };

    //logout
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            setUser(null)
        }
    };

    // Check authentication when application starts
    useEffect(() => {
        getCurrentUser();
    }, []);

    const value = {
        user,
        loading,
        login,
        logout,
        getCurrentUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

//Custom hook
export const useAuth = () => {
    const  context = useContext(AuthContext);

    if(!context){
        throw new Error("UseAuth must be used inside AuthProvider");
    }

    return context;
};