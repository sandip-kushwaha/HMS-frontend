import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth.api";


const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    //Input change
    const handleChange = (e) => {
        const { name, value}= e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
//submit
const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if(
        !formData.fullName.trim() ||
        !formData.email.trim()  ||
        !formData.password
    ){
        setError("Full name, email and password are required");
        return;
    }

    try {
        setLoading(true);
        const response = await registerUser(formData);

        setSuccess( response.message || "Registration successful");

        //Clear form
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            password: "",
        });

        //Redirect to login
        setTimeout(() => {
            navigate("/login");
        }, 1000);
        
    } catch (error) {
        setError(
            error.response?.data?.message ||
            error.message ||
            "Registration failed"
        )
    } finally {
        setLoading(false)
    }

};


  return (
   <>
      <div>
        <h1>Register</h1>
        {/* Error */}
        {error && <p style={{color:"red"}}>{error}</p>}
        {/* Success */}
        {success && <p style={{color:"green"}}>{success}</p>}

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullName">Name</label>
                <input className='bg-white text-black '
                    type="text"
                    id="fullName"
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input className='bg-white text-black '
                   type="email"    
                   id="email"
                   name= "email"
                   value={formData.email}
                   onChange={handleChange}
                   placeholder="Enter your email"
                   required
                />
            </div>

            <div>
                <label htmlFor='phone'>Phone</label>
                <input className='bg-white text-black '
                  id='phone' 
                  type='text' 
                  name='phone' 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Enter phone number'
                  required
                  />
            </div>

            <div>
                <label htmlFor='password'>Password</label>
                <input className='bg-white text-black '
                   id='password'
                   type='password'
                   name='password'
                   value={formData.password}
                   onChange={handleChange}
                   placeholder='Enter password'
                   required
                />
            </div>

            <button className='bg-white text-black ' type='submit' disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>

      <p>
        Already have an account?{" "}
       <Link to="/login">Login</Link>
      </p>

     </div>
   </>
  )
}

export default Register;