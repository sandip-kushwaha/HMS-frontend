import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Star, Users2, XCircle } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import Header from "../../components/common/Header";
import UserDetailsModal from "../../components/user/UserDetailsModal";

import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
} from "../../api/users.api";

import { Search } from "lucide-react";
import { toast } from "react-toastify";


const Users = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

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

      const response = await getAllUsers();

      const userData = response?.data || [];

      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to fetch users.");
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

      const response = await getUserById(userId);

      setSelectedUser(response.data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to fetch user details.",
      );
    } finally {
      setViewLoading(false);
    }
  };

  //--------Change Role---------
  const handleChangeRole = async (userId, role) => {
    try {
      setActionId(userId);

      await updateUserRole(userId, role);

      // Refresh users list
      const response = await getAllUsers();

      setUsers(response.data || []);

      // Refresh selected user
      if (selectedUser?._id === userId) {
        const userResponse = await getUserById(userId);

        setSelectedUser(userResponse.data);
      }

      toast.success("User role updated successfully.");

    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to update user role.");
    } finally {
      setActionId(null);
    }
  };

  //--------Change Status----------
  const handleStatusChange = async (userId, currentStatus) => {
    try {
      setActionId(userId);

      await updateUserStatus(userId, !currentStatus);

      // Refresh users
      const response = await getAllUsers();

      setUsers(response.data || []);

      // Refresh selected user
      if (selectedUser?._id === userId) {
        const userResponse = await getUserById(userId);

        setSelectedUser(userResponse.data);
      }

      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully.`,
      );

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to update user status.",
      );
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

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);


  //------Statistics------
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = users.filter((user) => !user.isActive).length;
  const adminUsers = users.filter((user) => user.role === "admin").length;


  return (
    <div className="space-y-6">

      {/* Header */}
      {loading ? (
        <LoadingHeader/>
      ):(
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
        title="User Management"
        value="anage hotel staff accounts and permissions."
        />

        <div className="rounded-lg bg-gray-900 px-5 py-3">
          <p className="text-xs text-gray-400">Total Users</p>
          <p className="mt-1 text-xl font-bold text-white">{totalUsers}</p>
        </div>
      </div>
      )}

      {/* Statistics */}
      {loading ? (
        <LoadingStats/>
      ):(
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users2 size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />

        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={<XCircle size={22} />}
          iconClass="bg-red-500/10 text-red-400"
          valueClass="text-red-400"
        />

        <StatCard
          title="Administrators"
          value={adminUsers}
          icon={<Star size={22} />}
          iconClass="bg-gray-500/10 text-gray-400"
          valueClass="text-gray-400"
        />
      </div>
      )}

      {/* Filters */}
      {loading ? (
        <LoadingFilter/>
      ):(
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Search */}

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search />
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10
                         pr-4 text-sm text-white outline-none placeholder:text-gray-500
                         focus:border-blue-500"
            />
          </div>

          {/* Role */}

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white
                       outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all"> All Roles </option>
            <option value="admin"> Admin </option>
            <option value="waiter"> Waiter </option>
            <option value="kitchen"> Kitchen </option>
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white
                       outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all"> All Status </option>
            <option value="active"> Active </option>
            <option value="inactive"> Inactive </option>
          </select>
        </div>
      </div>
      )}


      {/* Users Table */}

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
                <LoadingRows />
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="text-4xl">👥</div>

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
                  <tr
                    key={user._id}
                    className="transition hover:bg-gray-800/40"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center
                                     rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400"
                        >
                          {user.fullName?.charAt(0).toUpperCase()}
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
                        disabled={actionId === user._id}
                        onChange={(e) =>
                          handleChangeRole(user._id, e.target.value)
                        }
                        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2
                                   text-sm capitalize text-white outline-none focus:border-blue-500
                                   disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        <option value="admin"> Admin </option>
                        <option value="waiter"> Waiter </option>
                        <option value="kitchen"> Kitchen </option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        disabled={actionId === user._id}
                        onClick={() =>
                          handleStatusChange(user._id, user.isActive)
                        }
                      >
                        {actionId === user._id ? (
                          "..."
                        ) : user.isActive ? (
                          <span className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            <CheckCircle size={15} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center cursor-pointer gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                            <XCircle size={15} />
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewUser(user._id)}
                          className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-medium cursor-pointer
                                     text-gray-300 transition  hover:bg-gray-700 hover:text-white"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Count */}
      {!loading && (
        <div className="text-base text-gray-800">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredUsers.length}
          </span>{" "}
          of <span className="font-medium text-gray-900">{users.length}</span>{" "}
          users
        </div>
      )}


      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />


      {/* View Loading */}
      {viewLoading && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />

              <p className="text-sm text-gray-300">Loading user details...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Loading header
const LoadingHeader = () => {
  return (
    <>
    <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-800" />

            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-800" />
          </div>

          <div className="h-22 w-22 animate-pulse rounded-lg bg-gray-800" />
        </div>
      </div>
    </>
  )
};

// Loading Stats  
const LoadingStats = () => {
  return(
    <>
     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />

                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

    </>
  )
};
       
// Loading Filter
const LoadingFilter = () => {
  return (
    <>
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-lg bg-gray-800"
              />
            ))}
          </div>
        </div> 
    </>
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
