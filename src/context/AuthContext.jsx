import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
} from "../api/auth.api";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
 
    //Get current user
    const checkCurrentUser = async () => {
        try {
            const response = await getCurrentUser();
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


  //Login
    const login = async (email, password) => {
       const response = await loginUser({ email, password, });

        setUser(response.data.user);

        return response;
   };

   //Logout
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    };


    //Check authentication when app starts
    useEffect(() => {
        checkCurrentUser();
    }, []);


    const value = {
        user,
        loading,
        login,
        logout,
        getCurrentUser: checkCurrentUser,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

//Custem hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};