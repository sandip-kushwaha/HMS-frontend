import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';


const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //Input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //submit
    const handleSubmit = async (e) => {
       e.preventDefault();

       setError("");

       if(!formData.email || !formData.password){
        setError("Email and Password are required");
        return
       }

       try {
        setLoading(true);

        const response = await login(
            formData.email,
            formData.password
        );

        const user = response.data.user;

        //Redirect according to role
        if(user.role === "admin"){
            navigate("/admin");
        }else if(user.role === "kitchen"){
            navigate("/kitchen");
        }else if(user.role === "waiter"){
            navigate("/waiter");
        }else{
            setError("Invalid user role");
        }
        
       } catch (error) {
         setError(error.response?.data?.message || 
                  error.message  ||
                  "Login failed"
                );
       } finally {
        setLoading(false);
       }
    };

  return (
    <>
    <div>
        <h1>Login</h1>

        {error && ( <p style={{color: "red"}}>{error}</p> )}

     <form onSubmit={handleSubmit}>
        <div>
            <label>Email</label>
            <input className='bg-white text-black ' type="email" name="email" 
            value={formData.email} 
            onChange={handleChange} placeholder="Enter email" />
        </div>
        <div>
            <label>Password</label>
            <input className='bg-white text-black ' type="password" name="password"
            value={formData.password} 
            onChange={handleChange} placeholder="Enter password" />
        </div>
        <button className='bg-white text-black ' type="submit" disabled={loading}>
         {loading ? "Logging in..." : "Login"}
        </button>
     </form>
    </div>
    </>
  )
}

export default Login;