import React, { useState } from "react";
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

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    
    if (!formData.fullName.trim()) {
      return "Full name is required.";
    }

    if (formData.fullName.trim().length < 3) {
      return "Full name must be at least 3 characters.";
    }


    if (!formData.email.trim()) {
      return "Email is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }


    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(formData.phone.trim())) {
      return "Phone number must contain exactly 10 digits.";
    }


    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      setSuccess(
        response?.message || "Registration successful."
      );

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
      });

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);
      
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-14 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/20">
            HMS
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Create your hotel staff account
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
          
          {/* Card Header */}
          <div className="border-b border-gray-800 px-6 py-5">
            <h2 className="text-xl font-semibold text-white">
              Register
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your information to create an account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <span className="text-base">⚠</span>
                <p>{error}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                <span className="text-base">✓</span>
                <p>{success}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="mb-5">
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+977 98XXXXXXXX"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <p className="mt-2 text-xs text-gray-500">
                Use a strong password to keep your account secure.
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Registering...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-800 px-6 py-5 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-6 text-center text-xs text-gray-600">
          Hotel Management System
        </p>
      </div>
    </div>
  );
};

export default Register;