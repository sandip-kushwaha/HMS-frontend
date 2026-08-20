import { useEffect, useState } from "react";

const UserModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  loading = false,
  error = "",
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "waiter",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "waiter",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "waiter",
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">

          <div>
            <h2 className="text-xl font-bold text-white">
              {user ? "Edit User" : "Add User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {user
                ? "Update staff account information"
                : "Create a new staff account"}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-2 py-1 text-2xl text-gray-500 transition hover:bg-gray-800 hover:text-white disabled:opacity-50"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="space-y-4 p-6">

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                disabled={loading}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={loading}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm capitalize text-white outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="admin">
                  Admin
                </option>

                <option value="waiter">
                  Waiter
                </option>

                <option value="kitchen">
                  Kitchen
                </option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-800 px-6 py-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : user
                  ? "Update User"
                  : "Create User"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default UserModal;