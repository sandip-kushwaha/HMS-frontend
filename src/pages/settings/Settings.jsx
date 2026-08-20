import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../api/auth.api";
import { updateProfile } from "../../api/users.api";



const Settings = () => {
  const { user, getCurrentUser } = useAuth();
  
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Messages
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");


  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  //------- PROFILE MODAL
  const openProfileModal = () => {
    setProfileData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });

    setProfileError("");
    setProfileSuccess("");

    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    if (profileLoading) return;

    setShowProfileModal(false);
    setProfileError("");
    setProfileSuccess("");
  };

  // Profile validation
  const validateProfile = () => {
    if (!profileData.fullName.trim()) {
      return "Full name is required.";
    }

    if (profileData.fullName.trim().length < 3) {
      return "Full name must be at least 3 characters.";
    }

    if (!profileData.email.trim()) {
      return "Email is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(profileData.email)) {
      return "Please enter a valid email address.";
    }

    if (!profileData.phone.trim()) {
      return "Phone number is required.";
    }

    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(profileData.phone.trim())) {
      return "Phone number must contain exactly 10 digits.";
    }

    return null;
  };


  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    const validationError = validateProfile();

    if (validationError) {
      setProfileError(validationError);
      return;
    }

    try {
      setProfileLoading(true);

      const response = await updateProfile({
        fullName: profileData.fullName.trim(),
        email: profileData.email.trim().toLowerCase(),
        phone: profileData.phone.trim(),
      });

      setProfileSuccess(
        response?.message || "Profile updated successfully."
      );

      // Refresh current user in AuthContext
      await getCurrentUser();

      // Close modal after short delay
      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSuccess("");
      }, 1200);

    } catch (error) {
      console.error("Update profile error:", error);

      setProfileError(
        error.response?.data?.message ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };


  //-----PASSWORD MODAL
  const openPasswordModal = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("");
    setPasswordSuccess("");

    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (passwordLoading) return;

    setShowPasswordModal(false);
    setPasswordError("");
    setPasswordSuccess("");

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };


  // Password validation
  const validatePassword = () => {
    if (!passwordData.oldPassword) {
      return "Current password is required.";
    }

    if (!passwordData.newPassword) {
      return "New password is required.";
    }

    if (passwordData.newPassword.length < 8) {
      return "New password must be at least 8 characters.";
    }

    if (!passwordData.confirmPassword) {
      return "Please confirm your new password.";
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      return "New password and confirm password do not match.";
    }

    if (
      passwordData.oldPassword ===
      passwordData.newPassword
    ) {
      return "New password must be different from current password.";
    }

    return null;
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    const validationError = validatePassword();

    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess(
        response?.message ||
        "Password changed successfully."
      );

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Close after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1200);

    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        error.response?.data?.message ||
        "Failed to change password. Please try again."
      );
    } finally {
      setPasswordLoading(false);
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your account information and security.
        </p>
      </div>


      {/* ================= PROFILE CARD ================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Card Header */}

        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Profile Information
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Your account information
          </p>
        </div>


        {/* Profile Content */}

        <div className="p-6">

          {/* User avatar */}

          <div className="flex items-center gap-4 mb-8">

            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {user?.fullName || "User"}
              </h3>

              <p className="text-gray-500">
                {user?.email}
              </p>
            </div>

          </div>


          {/* User Details */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user?.fullName || "—"}
              </p>
            </div>


            {/* Email */}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-medium text-gray-800 break-all">
                {user?.email || "—"}
              </p>
            </div>


            {/* Phone */}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user?.phone || "—"}
              </p>
            </div>


            {/* Role */}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="mt-1 font-semibold text-blue-600 capitalize">
                {user?.role || "—"}
              </p>
            </div>


            {/* Status */}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <span
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  user?.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>
            </div>


            {/* Last Login */}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Last Login
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "—"}
              </p>
            </div>

          </div>


          {/* Update Profile Button */}

          <div className="mt-6">

            <button
              onClick={openProfileModal}
              className="px-5 py-2.5 rounded-lg cursor-pointer bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Update Profile
            </button>

          </div>

        </div>
      </div>


      {/* ================= SECURITY CARD ================= */}

      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-200">

          <h2 className="text-xl font-semibold text-gray-800">
            Security
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your account password.
          </p>

        </div>


        <div className="p-6 flex items-center justify-between gap-5">

          <div>

            <h3 className="font-semibold text-gray-800">
              Password
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Change your account password regularly
              to keep your account secure.
            </p>

          </div>


          <button
            onClick={openPasswordModal}
            className="shrink-0 px-5 py-2.5 cursor-pointer rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 transition"
          >
            Change Password
          </button>

        </div>

      </div>


      {/* UPDATE PROFILE MODAL */}

      {showProfileModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}

          <div
            onClick={closeProfileModal}
            className="absolute inset-0 bg-black/50"
          />


          {/* Modal */}

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Update Profile
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update your personal information.
                </p>
              </div>


              <button
                onClick={closeProfileModal}
                disabled={profileLoading}
                className="text-gray-500 cursor-pointer hover:text-gray-800 text-2xl disabled:opacity-50"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleUpdateProfile}
              className="p-6"
            >

              {/* Error */}

              {profileError && (

                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {profileError}
                </div>

              )}


              {/* Success */}

              {profileSuccess && (

                <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  {profileSuccess}
                </div>

              )}


              {/* Full Name */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={profileData.fullName}
                  disabled={profileLoading}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

              </div>


              {/* Email */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={profileData.email}
                  disabled={profileLoading}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

              </div>


              {/* Phone */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>

                <input
                  type="text"
                  value={profileData.phone}
                  disabled={profileLoading}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={profileLoading}
                  className="px-5 py-2.5 cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-5 py-2.5 rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {profileLoading
                    ? "Updating..."
                    : "Update Profile"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* CHANGE PASSWORD MODAL */}

      {showPasswordModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}

          <div
            onClick={closePasswordModal}
            className="absolute inset-0 bg-black/50"
          />


          {/* Modal */}

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <h2 className="text-xl font-semibold text-gray-800">
                  Change Password
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Create a new password for your account.
                </p>

              </div>


              <button
                onClick={closePasswordModal}
                disabled={passwordLoading}
                className="text-gray-500 cursor-pointer hover:text-gray-800 text-2xl disabled:opacity-50"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleChangePassword}
              className="p-6"
            >

              {/* Error */}

              {passwordError && (

                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {passwordError}
                </div>

              )}


              {/* Success */}

              {passwordSuccess && (

                <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  {passwordSuccess}
                </div>

              )}


              {/* Current Password */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>

                <input
                  type="password"
                  value={passwordData.oldPassword}
                  disabled={passwordLoading}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

              </div>


              {/* New Password */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>

                <input
                  type="password"
                  value={passwordData.newPassword}
                  disabled={passwordLoading}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters.
                </p>

              </div>


              {/* Confirm Password */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  disabled={passwordLoading}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="px-5 py-2.5 cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2.5 cursor-pointer rounded-lg bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50"
                >
                  {passwordLoading
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Settings;