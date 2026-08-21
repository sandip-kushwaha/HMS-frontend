import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { AtSign, UserKey } from "lucide-react";

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

    if (!formData.email || !formData.password) {
      setError("Email and Password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await login(
        formData.email,
        formData.password
      );

      const user = response.data.user;

      //Redirect according to role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "kitchen") {
        navigate("/kitchen");
      } else if (user.role === "waiter") {
        navigate("/waiter");
      } else {
        setError("Invalid user role");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">

          {/* Header */}
          <div className="border-b border-gray-800 px-6 py-7 text-center">

            {/* Logo */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
              🏨
            </div>

            <h1 className="mt-5 text-3xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Sign in to your account to continue
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                <span className="text-base">
                  ⚠
                </span>

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* Email */}
            <div className="mb-5">

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <AtSign size={18}/>
                </span>

                <input
                  id="email"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-11 pr-4 text-m text-white outline-none   transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Password */}
            <div className="mb-6">

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Password
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <UserKey size={20}/>
                </span>

                <input
                  id="password"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-11 pr-4 text-m text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={loading}
                />

              </div>

            </div>

            {/* Login Button */}
            <button
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Logging in...

                </span>
              ) : (
                "Login"
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="border-t border-gray-800 px-6 py-4 text-center">

            <p className="text-xs text-gray-500">
              Secure staff login
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;