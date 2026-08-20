import { useEffect, useState } from "react";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../../api/users.api";



const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  //----Get All Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllUsers();

      setUsers(response.data || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  //----GetAll User By Id
  const handleViewUser = async (userId) => {
    try {
      setViewLoading(true);

      const response = await getUserById(userId);

      setSelectedUser(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to fetch user details.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  //---Change Role function
  const handleChangeRole = async (userId, role) => {
    try {
      setActionLoading(true);

      await updateUserRole(userId, role);

      // Refresh users list
      const response = await getAllUsers();
      setUsers(response.data);

      // Refresh selected user
      const userResponse = await getUserById(userId);
      console.log(userResponse.data)
      setSelectedUser(userResponse.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to update user role.");
    } finally {
      setActionLoading(false);
    }
  };

  //--Active/Inactive function
  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setActionLoading(true);

      await updateUserStatus(userId, !currentStatus);

      const response = await getAllUsers();
      setUsers(response.data);

      const userResponse = await getUserById(userId);
      setSelectedUser(userResponse.data);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to update user status.",);
    } finally {
      setActionLoading(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>

          <p className="mt-1 text-gray-500">Manage hotel staff accounts.</p>
        </div>

        <div className="px-4 py-2 bg-gray-100 rounded-lg">
          <span className="text-sm text-gray-500">Total Users</span>

          <p className="text-xl font-bold text-gray-800">{users.length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-white border rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Email
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Phone
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Role
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 font-semibold text-gray-700">
                          {user.fullName?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {user.fullName}
                          </p>

                          <p className="text-xs text-gray-500">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone}
                    </td>

                    {/* Role */}
                    {/* <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {user.role}
                      </span>
                    </td> */}
                    <td>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Role</p>

                      <select
                        value={user.role}
                        disabled={actionLoading}
                        onChange={(e) =>handleChangeRole(user._id, e.target.value)}
                        className="mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800"
                      >
                        <option value="admin">Admin</option>
                        <option value="waiter">Waiter</option>
                        <option value="kitchen">Kitchen</option>
                      </select>
                    </div>
                    </td>
                    {/* Status */}
                    {/* <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td> */}
                    <td>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Account Status</p>

                      <button
                        disabled={actionLoading}
                        onClick={() =>
                          handleStatusChange(user._id, user.isActive,)
                        }
                        className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          user.isActive
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {user.isActive ? "Deactivate User" : "Activate User"}
                      </button>
                    </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewUser(user._id)}
                        className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ----get-user-by-id--- */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  User Details
                </h2>

                <p className="text-sm text-gray-500">
                  Staff account information
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white bg-blue-600 rounded-full">
                  {selectedUser.fullName?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedUser.fullName}
                  </h3>

                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Full Name</p>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedUser.fullName}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Email</p>

                  <p className="mt-1 font-medium text-gray-800 break-all">
                    {selectedUser.email}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Phone</p>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedUser.phone}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Role</p>

                  <p className="mt-1 font-medium capitalize text-blue-600">
                    {selectedUser.role}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Account Status</p>

                  <span
                    className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                      selectedUser.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Last Login</p>

                  <p className="mt-1 font-medium text-gray-800">
                    {selectedUser.lastLogin
                      ? new Date(selectedUser.lastLogin).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created</span>

                  <span className="font-medium text-gray-700">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">Updated</span>

                  <span className="font-medium text-gray-700">
                    {selectedUser.updatedAt
                      ? new Date(selectedUser.updatedAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---Loading--UI---click-view */}
      {viewLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="px-6 py-4 bg-white rounded-lg shadow-lg">
            Loading user details...
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
