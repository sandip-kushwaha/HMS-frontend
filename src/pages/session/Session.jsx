import { useEffect, useMemo, useState } from "react";

import {
  Search,
  ClipboardList,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Ban,
} from "lucide-react";

import {
  getActiveSessions,
  closeSession,
  cancelSession,
} from "../../api/session.api";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";

const Sessions = () => {
  // SESSION DATA
  const [sessions, setSessions] = useState([]);

  // LOADING / ERROR
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [actionId, setActionId] = useState(null);
  // SEARCH
  const [search, setSearch] = useState("");

  // FETCH ACTIVE SESSIONS
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getActiveSessions();
      const sessionData = response?.data || [];

      setSessions(Array.isArray(sessionData) ? sessionData : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Failed to fetch active sessions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchSessions();
  }, []);

  // FILTER SESSIONS
  const filteredSessions = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return sessions.filter((session) => {
      if (!searchText) {
        return true;
      }

      const tableNumber = session.table?.tableNumber?.toLowerCase() || "";

      const customerName = session.customerName?.toLowerCase() || "";

      return (
        tableNumber.includes(searchText) || customerName.includes(searchText)
      );
    });
  }, [sessions, search]);

  // STATISTICS
  const totalSessions = sessions.length;

  const occupiedTables = new Set(
    sessions.map((session) => session.table?._id).filter(Boolean),
  ).size;

  const totalCustomers = sessions.length;

  // SUCCESS MESSAGE
  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  // CLOSE SESSION
  const handleClose = async (session) => {
    const confirmed = window.confirm(
      `Are you sure you want to close the session for ${session.table?.tableNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(session._id);
      setError("");
      setSuccess("");

      await closeSession(session._id);

      // Remove closed session from active list
      setSessions((prev) => prev.filter((item) => item._id !== session._id));

      showSuccess(
        `Session for ${session.table?.tableNumber} closed successfully.`,
      );
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to close session.");
    } finally {
      setActionId(null);
    }
  };

  // CANCEL SESSION
  const handleCancel = async (session) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the session for ${session.table?.tableNumber}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(session._id);
      setError("");
      setSuccess("");

      await cancelSession(session._id);

      // Remove cancelled session
      setSessions((prev) => prev.filter((item) => item._id !== session._id));

      showSuccess(
        `Session for ${session.table?.tableNumber} cancelled successfully.`,
      );
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to cancel session.");
    } finally {
      setActionId(null);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }
    return new Date(date).toLocaleString();
  };

  // SESSION STATUS CLASS
  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case "closed":
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";

      case "cancelled":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  // STATUS ICON
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={15} />;

      case "cancelled":
        return <XCircle size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-800" />
            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-800" />
          </div>
          <div className="h-11 w-28 animate-pulse rounded-lg bg-gray-800" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-800" />
                  <div className="mt-3 h-8 w-12 animate-pulse rounded bg-gray-800" />
                </div>
                <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        {/* Search */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="h-11 w-full animate-pulse rounded-lg bg-gray-800" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex justify-between">
                <div>
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-800" />
                  <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-800" />
                </div>
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // UI
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="Session Management"
          value="Manage active customer sessions."
        />
        <Button
          onClick={fetchSessions}
          disabled={loading}
          value={
            <>
              <RefreshCw size={18} />
              Refresh
            </>
          }
        />
        
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="ml-4 cursor-pointer text-lg hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Active Sessions"
          value={totalSessions}
          icon={<ClipboardList size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Occupied Tables"
          value={occupiedTables}
          icon={<Users size={22} />}
          iconClass="bg-red-500/10 text-red-400"
          valueClass="text-red-400"
        />

        <StatCard
          title="Customers"
          value={totalCustomers}
          icon={<Users size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search table or customer..."
            className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* SESSION CARDS */}
      {filteredSessions.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center">
          <ClipboardList size={48} className="mx-auto text-gray-700" />

          <h3 className="mt-4 text-lg font-semibold text-gray-300">
            No active sessions found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            There are currently no active customer sessions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSessions.map((session) => (
            <div
              key={session._id}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-lg"
            >
              {/* CARD HEADER */}
              <div className="border-b border-gray-800 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {session.table?.tableNumber || "Unknown Table"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Customer Session
                    </p>
                  </div>

                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      session.status,
                    )}`}
                  >
                    {getStatusIcon(session.status)}

                    {session.status}
                  </span>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="space-y-4 p-5">
                {/* CUSTOMER */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Customer</span>

                  <span className="font-medium text-gray-200">
                    {session.customerName || "Guest"}
                  </span>
                </div>

                {/* CAPACITY */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Table Capacity</span>

                  <span className="flex items-center gap-1.5 font-medium text-gray-200">
                    <Users size={16} className="text-gray-400" />
                    {session.table?.capacity || 0} people
                  </span>
                </div>

                {/* LOCATION */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>

                  <span className="font-medium capitalize text-gray-200">
                    {session.table?.location || "N/A"}
                  </span>
                </div>

                {/* STARTED */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Started</span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
                    <Clock size={15} className="text-gray-500" />
                    {formatDate(session.startedAt)}
                  </span>
                </div>

                {/* SESSION ID */}
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-3">
                  <p className="text-xs text-gray-500">Session ID</p>
                  <p className="mt-1 truncate text-xs text-gray-300">
                    {session._id}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-3">
                  {/* CLOSE */}

                  <button
                    onClick={() => handleClose(session)}
                    disabled={actionId === session._id}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {actionId === session._id ? "Processing..." : "Close"}
                  </button>

                  {/* CANCEL */}
                  <button
                    onClick={() => handleCancel(session)}
                    disabled={actionId === session._id}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Ban size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESULT COUNT */}
      <div className="text-base text-gray-800">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {filteredSessions.length}
        </span>{" "}
        of <span className="font-medium text-gray-900">{sessions.length}</span>{" "}
        active sessions
      </div>
    </div>
  );
};

// STAT CARD
const StatCard = ({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-white",
}) => {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <p className={`mt-2 text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default Sessions;
