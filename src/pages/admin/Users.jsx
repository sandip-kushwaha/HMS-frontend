import { useEffect, useMemo, useState } from "react";

import UserDetailsModal from "../../components/user/UserDetailsModal";

import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../../api/users.api";
import { Search } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");

  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);

  const [viewLoading, setViewLoading] = useState(false);
  const [actionId, setActionId] = useState(null);


  //-----Fetch Users------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setUserError("");

      const response = await getAllUsers();

      const userData = response?.data || [];

      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error(error);

      setUserError( error.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchUsers();
  }, []);


  //-------View User--------
  const handleViewUser = async (userId) => {
    try {
      setViewLoading(true);
      setError("");

      const response = await getUserById(userId);

      setSelectedUser(response.data);
    } catch (error) {
      console.error(error);

      setError( error.response?.data?.message || "Failed to fetch user details.");
    } finally {
      setViewLoading(false);
    }
  };


  //--------Change Role---------

  const handleChangeRole = async (userId, role) => {
    try {
      setActionId(userId);
      setError("");
      setSuccess("");

      await updateUserRole(userId, role);

      // Refresh users list
      const response = await getAllUsers();

      setUsers(response.data || []);

      // Refresh selected user
      if (selectedUser?._id === userId) {
        const userResponse = await getUserById(userId);

        setSelectedUser(userResponse.data);
      }

      setSuccess("User role updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (error) {
      console.error(error);

      setError( error.response?.data?.message ||"Failed to update user role.");
    } finally {
      setActionId(null);
    }
  };


  //--------Change Status----------

  const handleStatusChange = async (
    userId,
    currentStatus,
  ) => {
    try {
      setActionId(userId);
      setError("");
      setSuccess("");

      await updateUserStatus(
        userId,
        !currentStatus,
      );

      // Refresh users
      const response = await getAllUsers();

      setUsers(response.data || []);

      // Refresh selected user
      if (selectedUser?._id === userId) {
        const userResponse = await getUserById(userId);

        setSelectedUser(userResponse.data);
      }

      setSuccess( `User ${!currentStatus ? "activated" : "deactivated"} successfully.`);

      setTimeout(() => {
        setSuccess("");
      }, 2500);

    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to update user status.");
    } finally {
      setActionId(null);
    }
  };


  //-------Filter Users----

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch = 
        !searchText ||
        user.fullName?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.phone?.toLowerCase().includes(searchText);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      let matchesStatus = true;

      if (statusFilter === "active") {
        matchesStatus = user.isActive;
      }

      if (statusFilter === "inactive") {
        matchesStatus = !user.isActive;
      }

      return (matchesSearch && matchesRole && matchesStatus);
    });
  }, [users, search, roleFilter, statusFilter,]);


  //------Statistics------
  const totalUsers = users.length;

  const activeUsers = users.filter((user) => user.isActive).length;

  const inactiveUsers = users.filter((user) => !user.isActive).length;

  const adminUsers = users.filter((user) => user.role === "admin").length;


  return (
    <div className="space-y-6">

      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            User Management
          </h1>

          <p className="mt-1 text-lg text-gray-500">
            Manage hotel staff accounts and
            permissions.
          </p>
        </div>

        <div className="rounded-lg bg-gray-900 px-5 py-3">
          <p className="text-xs text-gray-400">
            Total Users
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {totalUsers}
          </p>
        </div>
      </div>

      {/* ================================= */}
      {/* Success Message */}
      {/* ================================= */}

      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10
                     px-4 py-3 text-sm text-green-400"
        >
          {success}
        </div>
      )}

      {/* ================================= */}
      {/* Error Message */}
      {/* ================================= */}

      {error && (
        <div
          className="flex items-center justify-between rounded-lg border border-red-500/20
                     bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="ml-4 text-lg hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* Statistics */}
      {/* ================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers} icon="👥"/>

        <StatCard title="Active Users" value={activeUsers} icon="✓"/>

        <StatCard title="Inactive Users" value={inactiveUsers} icon="●"/>

        <StatCard title="Administrators" value={adminUsers} icon="★"/>
      </div>

      {/* ================================= */}
      {/* Filters */}
      {/* ================================= */}

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          {/* Search */}

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search/>
            </span>

            <input type="text" value={search} 
            onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10
                         pr-4 text-sm text-white outline-none placeholder:text-gray-500
                         focus:border-blue-500"
            />
          </div>

          {/* Role */}

          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white
                       outline-none focus:border-blue-500"
          >
            <option value="all"> All Roles </option>
            <option value="admin"> Admin </option>
            <option value="waiter"> Waiter </option>
            <option value="kitchen"> Kitchen </option>
          </select>

          {/* Status */}

          <select value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white
                       outline-none focus:border-blue-500"
          >
            <option value="all"> All Status </option>
            <option value="active"> Active </option>
            <option value="inactive"> Inactive </option>
          </select>

        </div>
      </div>

      {/* ================================= */}
      {/* Users Table */}
      {/* ================================= */}
      {userError && (
         <div className="text-sm text-red-600">{userError}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <div className="overflow-x-auto">

          <table className="w-full min-w-250">

            {/* Table Header */}

            <thead className="border-b border-gray-800 bg-gray-800/50">
              <tr>
                <th className="px-15 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Role
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-800">
              
             {loading ? (
               <LoadingRows/>
             ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="text-4xl">
                      👥
                    </div>

                    <p className="mt-3 font-medium text-gray-300">
                      No users found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-800/40">

                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center
                                     rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400"
                        >
                          {user.fullName ?.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-medium text-white">
                            {user.fullName}
                          </p>

                          <p className="mt-1 max-w-45 truncate text-xs text-gray-500">
                            ID: {user._id}
                          </p>

                        </div>

                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <p className="max-w-55 truncate text-sm text-gray-300">
                        {user.email}
                      </p>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-300">
                        {user.phone || "N/A"}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">

                      <select
                        value={user.role}
                        disabled={
                          actionId === user._id
                        }
                        onChange={(e) =>
                          handleChangeRole(
                            user._id,
                            e.target.value,
                          )
                        }
                        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2
                                   text-sm capitalize text-white outline-none focus:border-blue-500
                                   disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="admin"> Admin </option>
                        <option value="waiter"> Waiter </option>
                        <option value="kitchen"> Kitchen </option>
                      </select>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <button
                        disabled={ actionId === user._id }
                        onClick={() =>
                          handleStatusChange(
                            user._id,
                            user.isActive,
                          )
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition
                                    ${
                                      user.isActive
                                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                        : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                    }`}
                      >
                        {actionId === user._id ? "..." : user.isActive ? "Active" : "Inactive"}
                      </button>

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            handleViewUser(
                              user._id,
                            )
                          }
                          className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-medium
                                     text-gray-300 transition hover:bg-gray-700 hover:text-white"
                        >
                          View
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )};
            </tbody>
          </table>

        </div>
      </div>

      {/* ================================= */}
      {/* Result Count */}
      {/* ================================= */}

      {!loading && (
        <div className="text-base text-gray-800">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">
            {users.length}
          </span>{" "}
          users
        </div>
      )}

      {/* ================================= */}
      {/* User Details Modal */}
      {/* ================================= */}

      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* ================================= */}
      {/* View Loading */}
      {/* ================================= */}

      {viewLoading && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">

              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500"
              />

              <p className="text-sm text-gray-300">
                Loading user details...
              </p>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};


//------Stat Card-----

const StatCard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10
                     text-lg text-blue-400"
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

//------Loading Rows-----
const LoadingRows = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <tr key={item}>
          <td className="px-5 py-5" colSpan="6">
            <div className="flex animate-pulse items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-800" />
              <div>
              <div className="h-5 w-30 rounded bg-gray-800" />
               <div className="h-3 w-40 mt-2 rounded bg-gray-800" />
              </div>
              <div className="h-5 w-35 ml-4 rounded bg-gray-800" />
              <div className="h-5 w-30 rounded bg-gray-800" />
              <div className="h-9 w-25 rounded bg-gray-800" />
              <div className="h-5 w-30 ml-10 rounded bg-gray-800" />
              <div className="h-8 w-11 ml-15 rounded bg-gray-800" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default Users;