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

  // ================= PROFILE MODAL =================

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

      setProfileSuccess(response?.message || "Profile updated successfully.");

      await getCurrentUser();

      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSuccess("");
      }, 1200);
    } catch (error) {
      console.error("Update profile error:", error);

      setProfileError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ================= PASSWORD MODAL =================

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

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return "New password and confirm password do not match.";
    }

    if (passwordData.oldPassword === passwordData.newPassword) {
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

      setPasswordSuccess(response?.message || "Password changed successfully.");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1200);
    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password. Please try again.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

        <p className="mt-1 text-gray-500 text-lg">
          Manage your account information and security.
        </p>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        {/* Card Header */}

        <div className="border-b border-gray-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">
            Profile Information
          </h2>

          <p className="mt-1 text-sm text-gray-400">Your account information</p>
        </div>

        {/* Card Body */}

        <div className="p-6">
          {/* User */}

          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-2xl font-bold text-blue-400">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                {user?.fullName || "User"}
              </h3>

              <p className="text-gray-400">{user?.email || "No email"}</p>
            </div>
          </div>

          {/* User Details */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {/* Full Name */}

            <SettingInfo title="Full Name" value={user?.fullName || "—"} />

            {/* Email */}

            <SettingInfo title="Email" value={user?.email || "—"} breakAll />

            {/* Phone */}

            <SettingInfo title="Phone" value={user?.phone || "—"} />

            {/* Role */}

            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Role
              </p>

              <p className="mt-2 font-semibold capitalize text-blue-400">
                {user?.role || "—"}
              </p>
            </div>

            {/* Status */}

            <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Account Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  user?.isActive
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Last Login */}

            <SettingInfo
              title="Last Login"
              value={
                user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "—"
              }
            />
          </div>

          {/* Button */}

          <div className="mt-6 border-t border-gray-800 pt-6">
            <button
              onClick={openProfileModal}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ================= SECURITY CARD ================= */}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        {/* Header */}

        <div className="border-b border-gray-800 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">Security</h2>

          <p className="mt-1 text-sm text-gray-400">
            Manage your account password and security.
          </p>
        </div>

        {/* Security Content */}

        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
              🔒
            </div>

            <div>
              <h3 className="font-semibold text-white">Password</h3>

              <p className="mt-1 text-sm text-gray-400">
                Change your account password regularly to keep your account
                secure.
              </p>
            </div>
          </div>

          <button
            onClick={openPasswordModal}
            className="shrink-0 rounded-lg bg-gray-800 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 hover:text-white"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* ================= UPDATE PROFILE MODAL ================= */}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="absolute inset-0" />

          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Update Profile
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Update your personal information.
                </p>
              </div>

              <button
                onClick={closeProfileModal}
                disabled={profileLoading}
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                       text-gray-400 hover:text-white hover:bg-gray-800
                       transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleUpdateProfile} className="p-6">
              {/* Error */}

              {profileError && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {profileError}
                </div>
              )}

              {/* Success */}

              {profileSuccess && (
                <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {profileSuccess}
                </div>
              )}

              {/* Full Name */}

              <DarkInput
                label="Full Name"
                type="text"
                value={profileData.fullName}
                disabled={profileLoading}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    fullName: e.target.value,
                  })
                }
              />

              {/* Email */}

              <DarkInput
                label="Email"
                type="email"
                value={profileData.email}
                disabled={profileLoading}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    email: e.target.value,
                  })
                }
              />

              {/* Phone */}

              <DarkInput
                label="Phone"
                type="text"
                value={profileData.phone}
                disabled={profileLoading}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phone: e.target.value,
                  })
                }
              />

              {/* Buttons */}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-800 pt-5">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={profileLoading}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {profileLoading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Create a new password for your account.
                </p>
              </div>

              <button
                onClick={closePasswordModal}
                disabled={passwordLoading}
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
                       text-gray-400 hover:text-white hover:bg-gray-800
                       transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleChangePassword} className="p-6">
              {/* Error */}

              {passwordError && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {passwordError}
                </div>
              )}

              {/* Success */}

              {passwordSuccess && (
                <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {passwordSuccess}
                </div>
              )}

              {/* Current Password */}

              <DarkInput
                label="Current Password"
                type="password"
                value={passwordData.oldPassword}
                disabled={passwordLoading}
                placeholder="Enter current password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
              />

              {/* New Password */}

              <DarkInput
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                disabled={passwordLoading}
                placeholder="Enter new password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />

              <p className="-mt-2 mb-4 text-xs text-gray-500">
                Password must be at least 8 characters.
              </p>

              {/* Confirm Password */}

              <DarkInput
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                disabled={passwordLoading}
                placeholder="Confirm new password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              {/* Buttons */}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-800 pt-5">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="rounded-lg border border-gray-700 bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ========================================
// Setting Info Component
// ========================================

const SettingInfo = ({ title, value, breakAll = false }) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
      <p className="text-xs uppercase tracking-wider text-gray-500">{title}</p>

      <p
        className={`mt-2 font-medium text-gray-200 ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
};

// ========================================
// Dark Input Component
// ========================================

const DarkInput = ({ label, type, value, onChange, disabled, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default Settings;
