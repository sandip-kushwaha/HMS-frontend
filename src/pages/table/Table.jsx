import { useEffect, useMemo, useState } from "react";
import StatCard from "../../components/common/StatCard";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";

import {
  Search,
  Edit,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  QrCode,
  ExternalLink,
  Plus,
} from "lucide-react";

import TableModal from "../../components/table/TableModel";

import {
  createTable,
  getAllTables,
  updateTable,
  updateTableStatus,
} from "../../api/tables.api";

import { openTable } from "../../api/session.api";
import { toast } from "react-toastify";

const Tables = () => {
  // TABLE DATA
  const [tables, setTables] = useState([]);

  
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  // SEARCH / FILTER
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  // MODAL
  const [modalOpen, setModalOpen] = useState(false);

  const [editingTable, setEditingTable] = useState(null);

  // FETCH TABLES
  const fetchTables = async () => {
    try {
      setLoading(true);

      const response = await getAllTables();

      const tableData = response?.data || [];

      setTables(Array.isArray(tableData) ? tableData : []);
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to fetch tables.");
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchTables();
  }, []);

  // FILTER TABLES
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText || table.tableNumber?.toLowerCase().includes(searchText);

      const matchesLocation =
        locationFilter === "all" || table.location === locationFilter;

      const matchesStatus =
        statusFilter === "all" || table.status === statusFilter;

      let matchesActive = true;

      if (activeFilter === "active") {
        matchesActive = table.isActive;
      }

      if (activeFilter === "inactive") {
        matchesActive = !table.isActive;
      }

      return matchesSearch && matchesLocation && matchesStatus && matchesActive;
    });
  }, [tables, search, locationFilter, statusFilter, activeFilter]);

  // STATISTICS
  const totalTables = tables.length;

  const availableTables = tables.filter(
    (table) => table.status === "available",
  ).length;

  const occupiedTables = tables.filter(
    (table) => table.status === "occupied",
  ).length;

  const inactiveTables = tables.filter((table) => !table.isActive).length;

  // OPEN ADD MODAL
  const handleAddTable = () => {
    setEditingTable(null);
    setModalOpen(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (table) => {
    setEditingTable(table);
    setModalOpen(true);
  };

  // CREATE / UPDATE
  const handleSubmit = async (tableData) => {
    try {
      setSaving(true);
  

      let response;

      // UPDATE
      if (editingTable) {
        response = await updateTable(editingTable._id, tableData);
      }
      // CREATE
      else {
        response = await createTable(tableData);
      }

      const savedTable = response?.data;

      if (!savedTable) {
        // throw new Error("Table data was not returned from server.");
        toast.error("Table data was not returned from server.")
      }

      // UPDATE EXISTING TABLE
      if (editingTable) {
        setTables((prev) =>
          prev.map((item) => (item._id === savedTable._id ? savedTable : item)),
        );

        toast.success("Table updated successfully.");
      }

      // CREATE NEW TABLE
      else {
        setTables((prev) => [savedTable, ...prev]);

        toast.success("Table created successfully.");
      }

      setModalOpen(false);

      setEditingTable(null);

    } catch (err) {
      console.error("TABLE ERROR:", err);

      console.error("BACKEND ERROR:", err.response?.data);

      toast.error(
        err.response?.data?.message || err.message || "Failed to save table.",
      );
    } finally {
      setSaving(false);
    }
  };

  // STATUS CHANGE
  const handleStatusChange = async (table, newStatus) => {
    try {
      setActionId(table._id);
     

      await updateTableStatus(table._id, newStatus);

      setTables((prev) =>
        prev.map((item) =>
          item._id === table._id ? { ...item, status: newStatus } : item,
        ),
      );

      toast.success(`Table ${table.tableNumber} status updated to ${newStatus}.`);

    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to update table status.");
    } finally {
      setActionId(null);
    }
  };

  //OPEN TABLE
  const handleOpenTable = async (table) => {
    try {
      setActionId(table._id);

      const response = await openTable(table._id);

      console.log("OPEN TABLE RESPONSE:", response);

      setTables((prev) =>
        prev.map((item) =>
          item._id === table._id ? { ...item, status: "occupied" } : item,
        ),
      );

      toast.success(`${table.tableNumber} opened successfully.`);

    } catch (err) {
      console.error("OPEN TABLE ERROR:", err);

      toast.error(err.response?.data?.message || "Failed to open table.");
    } finally {
      setActionId(null);
    }
  };

  // STATUS COLOR
  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case "occupied":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      case "reserved":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

      case "cleaning":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

      case "maintenance":
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";

      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  // STATUS ICON
  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle size={15} />;

      case "occupied":
        return <XCircle size={15} />;

      case "reserved":
        return <Clock size={15} />;

      case "cleaning":
        return <Settings size={15} />;

      default:
        return <Settings size={15} />;
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-800" />

            <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-800" />
          </div>

          <div className="h-11 w-32 animate-pulse rounded-lg bg-gray-800" />
        </div>

        {/* Loading Stats  */}
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

        {/* Loading Filters  */}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-lg bg-gray-800"
              />
            ))}
          </div>
        </div>

        {/* Loading Cards */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-800" />

                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
              </div>
              <div className="mt-6 space-y-4 justify-items-center">
                <div className="h-50 w-50 animate-pulse rounded bg-gray-800" />
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-800" />

                  <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-800" />

                  <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />
                </div>

                <div className="h-10 animate-pulse rounded-lg bg-gray-800" />

                <div className="h-10 animate-pulse rounded-lg bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Header
          title="Table Management"
          value="Manage your restaurant tables and seating."
        />
        <Button
          onClick={handleAddTable}
          value={
            <>
              <Plus size={18} />
              Add Table
            </>
          }
        />
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tables"
          value={totalTables}
          icon={<Users size={22} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Available"
          value={availableTables}
          icon={<CheckCircle size={22} />}
          iconClass="bg-green-500/10 text-green-400"
          valueClass="text-green-400"
        />

        <StatCard
          title="Occupied"
          value={occupiedTables}
          icon={<XCircle size={22} />}
          iconClass="bg-red-500/10 text-red-400"
          valueClass="text-red-400"
        />

        <StatCard
          title="Inactive"
          value={inactiveTables}
          icon={<Settings size={22} />}
          iconClass="bg-gray-500/10 text-gray-400"
          valueClass="text-gray-400"
        />
      </div>

      {/* SEARCH + FILTERS */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>

          {/* LOCATION */}

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Locations</option>

            <option value="indoor">Indoor</option>

            <option value="outdoor">Outdoor</option>

            <option value="vip">VIP</option>

            <option value="rooftop">Rooftop</option>
          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>

            <option value="available">Available</option>

            <option value="occupied">Occupied</option>

            <option value="reserved">Reserved</option>

            <option value="cleaning">Cleaning</option>

            <option value="maintenance">Maintenance</option>
          </select>

          {/* ACTIVE */}

          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Tables</option>

            <option value="active">Active</option>

            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* TABLE CARDS */}
      {filteredTables.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 py-16 text-center">
          <Users size={48} className="mx-auto text-gray-700" />

          <h3 className="mt-4 text-lg font-semibold text-gray-300">
            No tables found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTables.map((table) => (
            <div
              key={table._id}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-lg"
            >
              {/* CARD HEADER */}
              <div className="border-b border-gray-800 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-white">
                      {table.tableNumber}
                    </h2>
                    <p className="mt-1 text-sm capitalize text-gray-500">
                      {table.location}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">
                    {/* TABLE STATUS  */}
                    <span
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                        table.status,
                      )}`}
                    >
                      {getStatusIcon(table.status)}

                      {table.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="space-y-4 p-5">
                {/* QR CODE */}
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode size={17} className="text-blue-400" />

                      <span className="text-sm font-medium text-gray-300">
                        Table QR
                      </span>
                    </div>

                    {table.qrCode && (
                      <a
                        href={table.qrCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300"
                      >
                        View
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {table.qrCode ? (
                    <div className="flex justify-center">
                      <img
                        src={table.qrCode}
                        alt={`${table.tableNumber} QR Code`}
                        className="h-40 w-40 rounded-lg bg-white object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-700">
                      <div className="text-center">
                        <QrCode size={32} className="mx-auto text-gray-600" />

                        <p className="mt-2 text-xs text-gray-500">
                          QR code not generated
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CAPACITY */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Capacity</span>

                  <span className="flex items-center gap-1.5 font-medium text-gray-200">
                    <Users size={16} className="text-gray-400" />
                    {table.capacity} people
                  </span>
                </div>

                {/* LOCATION */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>

                  <span className="font-medium capitalize text-gray-200">
                    {table.location}
                  </span>
                </div>

                {/* ACTIVE STATUS */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500"> Active Status </span>

                  <span
                    className={`text-sm font-medium ${
                      table.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {table.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* STATUS SELECT */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Change Status
                  </label>

                  <select
                    value={table.status}
                    disabled={actionId === table._id}
                    onChange={(e) => handleStatusChange(table, e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="available">Available</option>

                    <option value="occupied">Occupied</option>

                    <option value="reserved">Reserved</option>

                    <option value="cleaning">Cleaning</option>

                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* OPEN TABLE */}
                {table.status === "available" && (
                    <button
                      onClick={() => handleOpenTable(table)}
                      disabled={actionId === table._id}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
                    >
                      <ExternalLink size={16} />
                      {actionId === table._id ? "Opening..." : "Open Table"}
                    </button>
                  )}
              

                {/* EDIT BUTTON */}
                <button
                  onClick={() => handleEdit(table)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
                >
                  <Edit size={16} />
                  Edit Table
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESULT COUNT */}
      {!loading && (
        <div className="text-base text-gray-800">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredTables.length}
          </span>{" "}
          of <span className="font-medium text-gray-900">{tables.length}</span>{" "}
          tables
        </div>
      )}

      {/* MODAL */}
      <TableModal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);

            setEditingTable(null);
          }
        }}
        onSubmit={handleSubmit}
        editingTable={editingTable}
        saving={saving}
      />
    </div>
  );
};

export default Tables;
